param(
  [switch]$ConfirmAuthorized,
  [ValidateRange(1, 12)]
  [int]$MaxWorkers = 6
)

$ErrorActionPreference = "Stop"

if (-not $ConfirmAuthorized) {
  throw "Confirme autorização de uso das imagens com -ConfirmAuthorized antes de baixar arquivos."
}

$root = Split-Path -Parent $PSScriptRoot
$originalPath = Join-Path $root "backup-original\index.html"
$catalogDataPath = Join-Path $root "catalog-data.js"
$imageRoot = Join-Path $root "images"
$organizedRoot = Join-Path $imageRoot "products"

if (-not (Test-Path -LiteralPath $originalPath -PathType Leaf)) {
  throw "Não foi encontrado o backup original: $originalPath"
}
if (-not (Test-Path -LiteralPath $catalogDataPath -PathType Leaf)) {
  throw "Não foi encontrado o catálogo local: $catalogDataPath"
}

$catalogText = Get-Content -Raw -Encoding UTF8 $catalogDataPath
$catalogJson = $catalogText -replace '^\s*window\.CATALOG_PRODUCTS\s*=\s*', '' -replace ';\s*$', ''
$catalogProducts = ConvertFrom-Json -InputObject $catalogJson
if ($catalogProducts.Count -ne 33) {
  throw "Esperados 33 produtos no catálogo local; encontrados $($catalogProducts.Count)."
}

$html = Get-Content -Raw -Encoding UTF8 $originalPath
$cardStarts = [regex]::Matches(
  $html,
  '(?is)<div\b(?=[^>]*class="[^"]*product-card)(?=[^>]*data-product-name="([^"]+)")(?=[^>]*data-product-url="([^"]+)")[^>]*>'
)
$cardImagesByPath = @{}
$platformIdsByPath = @{}
for ($index = 0; $index -lt $cardStarts.Count; $index++) {
  if ($index + 1 -lt $cardStarts.Count) {
    $segmentEnd = $cardStarts[$index + 1].Index
  } else {
    $segmentEnd = $html.Length
  }
  $segment = $html.Substring($cardStarts[$index].Index, $segmentEnd - $cardStarts[$index].Index)
  $productPath = [System.Net.WebUtility]::HtmlDecode($cardStarts[$index].Groups[2].Value).Trim("/")
  $platformId = [regex]::Match($segment, 'data-product-id="(\d+)"').Groups[1].Value
  if ($platformId -and -not $platformIdsByPath.ContainsKey($productPath)) {
    $platformIdsByPath[$productPath] = $platformId
  }
  if (-not $cardImagesByPath.ContainsKey($productPath)) {
    $cardImagesByPath[$productPath] = [System.Collections.Generic.List[string]]::new()
  }
  foreach ($imageMatch in [regex]::Matches($segment, '(?is)<img\b[^>]*\bsrc\s*=\s*["'']([^"'']+)')) {
    $imagePath = [System.Net.WebUtility]::HtmlDecode($imageMatch.Groups[1].Value)
    if ($imagePath -match '^images/' -and -not $cardImagesByPath[$productPath].Contains($imagePath)) {
      $cardImagesByPath[$productPath].Add($imagePath)
    }
  }
}

$sourceProducts = [System.Collections.Generic.List[object]]::new()
$mediaByUrl = [System.Collections.Generic.Dictionary[string, object]]::new([StringComparer]::OrdinalIgnoreCase)

function Get-SecureUrl([string]$Url) {
  if ($Url.StartsWith("http://images.tcdn.com.br/", [StringComparison]::OrdinalIgnoreCase)) {
    return "https://" + $Url.Substring(7)
  }
  return $Url
}

function Get-MediaPath([string]$Url, [string]$ProductId, [string]$Kind) {
  $secureUrl = Get-SecureUrl $Url
  if ($mediaByUrl.ContainsKey($secureUrl)) {
    return $mediaByUrl[$secureUrl].path
  }
  $uri = [Uri]$secureUrl
  $fileName = [Uri]::UnescapeDataString([IO.Path]::GetFileName($uri.AbsolutePath))
  $fileName = [regex]::Replace($fileName, '[^A-Za-z0-9._-]', '_')
  if ([string]::IsNullOrWhiteSpace($fileName)) {
    throw "URL sem nome de arquivo utilizável: $secureUrl"
  }
  $productDirectory = Join-Path $organizedRoot $ProductId
  if ($Kind -eq "swatch") {
    $productDirectory = Join-Path $productDirectory "swatches"
  }
  $relativePath = "images/products/$ProductId/"
  if ($Kind -eq "swatch") {
    $relativePath += "swatches/"
  }
  $relativePath += $fileName
  $targetPath = Join-Path $root ($relativePath -replace '/', '\')
  if (@($mediaByUrl.Values | Where-Object { $_.targetPath -eq $targetPath }).Count) {
    $stem = [IO.Path]::GetFileNameWithoutExtension($fileName)
    $extension = [IO.Path]::GetExtension($fileName)
    $hashBytes = [Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes($secureUrl))
    $suffix = ([BitConverter]::ToString($hashBytes) -replace '-', '').Substring(0, 10).ToLowerInvariant()
    $fileName = "$stem-$suffix$extension"
    $relativePath = "images/products/$ProductId/"
    if ($Kind -eq "swatch") {
      $relativePath += "swatches/"
    }
    $relativePath += $fileName
    $targetPath = Join-Path $root ($relativePath -replace '/', '\')
  }
  $mediaByUrl.Add($secureUrl, [pscustomobject]@{
    url = $secureUrl
    path = $relativePath
    targetPath = $targetPath
    productId = $ProductId
    kind = $Kind
  })
  return $relativePath
}

  foreach ($localProduct in $catalogProducts) {
    $productPath = ([string]$localProduct.path).Trim("/")
    if (-not $platformIdsByPath.ContainsKey($productPath)) {
      throw "Não foi possível cruzar o produto '$($localProduct.name)' com um cartão original ($productPath)."
    }
    $platformId = $platformIdsByPath[$productPath]

    $productResponse = Invoke-RestMethod -Uri "https://www.supervaidosaatacado.com.br/web_api/products/$platformId" -TimeoutSec 30
    $sourceProduct = $productResponse.Product
    if (-not $sourceProduct) {
      throw "A API pública não retornou o produto $platformId."
    }

    $variantRecords = [System.Collections.Generic.List[object]]::new()
    $variantPage = 1
    $variantTotal = 0
    do {
      $variantResponse = Invoke-RestMethod -Uri "https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=$platformId&limit=50&page=$variantPage" -TimeoutSec 30
      foreach ($record in @($variantResponse.Variants)) {
        $variantRecords.Add($record.Variant)
      }
      $variantTotal = [int]$variantResponse.paging.total
      $variantPage++
    } while ($variantRecords.Count -lt $variantTotal -and $variantPage -le 7)
    if ($variantRecords.Count -lt $variantTotal) {
      throw "A consulta paginada do produto $platformId retornou $($variantRecords.Count) de $variantTotal variantes."
    }

    $gallery = [System.Collections.Generic.List[object]]::new()
    $allProductUrls = [System.Collections.Generic.List[string]]::new()
    foreach ($image in @($sourceProduct.ProductImage)) {
      $url = if ($image.https) { [string]$image.https } else { [string]$image.http }
      if ($url -and -not $allProductUrls.Contains((Get-SecureUrl $url))) {
        $allProductUrls.Add((Get-SecureUrl $url))
        $relativePath = Get-MediaPath $url $platformId "gallery"
        $gallery.Add([pscustomobject]@{ url = Get-SecureUrl $url; path = $relativePath; source = "ProductImage" })
      }
    }

    $variantData = [System.Collections.Generic.List[object]]::new()
    $colorGroups = @{}
    $colorOrder = [System.Collections.Generic.List[string]]::new()
    $allSizes = [System.Collections.Generic.List[string]]::new()
    foreach ($variant in $variantRecords) {
      $color = ""
      $size = ""
      $swatchUrl = ""
      foreach ($sku in @($variant.Sku)) {
        if ($sku.type -match 'cor') {
          $color = [string]$sku.value
          $swatchUrl = if ($sku.image_secure) { [string]$sku.image_secure } else { [string]$sku.image }
        } elseif ($sku.type -match 'tam|size') {
          $size = [string]$sku.value
        }
      }
      $variantImagePaths = [System.Collections.Generic.List[string]]::new()
      foreach ($image in @($variant.VariantImage)) {
        $url = if ($image.https) { [string]$image.https } else { [string]$image.http }
        if ($url) {
          $relativePath = Get-MediaPath $url $platformId "variant"
          if (-not $variantImagePaths.Contains($relativePath)) {
            $variantImagePaths.Add($relativePath)
          }
        }
      }
      if ($variantImagePaths.Count -eq 0 -and $variant.illustrative_image) {
        $url = if ($variant.illustrative_image.https) { [string]$variant.illustrative_image.https } else { [string]$variant.illustrative_image.http }
        if ($url) {
          $variantImagePaths.Add((Get-MediaPath $url $platformId "variant"))
        }
      }
      if ($color -and -not $colorGroups.ContainsKey($color)) {
        $colorGroups[$color] = [System.Collections.Generic.List[string]]::new()
        $colorOrder.Add($color)
      }
      if ($color) {
        foreach ($path in $variantImagePaths) {
          if (-not $colorGroups[$color].Contains($path)) {
            $colorGroups[$color].Add($path)
          }
        }
      }
      if ($size -and -not $allSizes.Contains($size)) {
        $allSizes.Add($size)
      }
      $swatchPath = ""
      if ($swatchUrl) {
        $swatchPath = Get-MediaPath $swatchUrl $platformId "swatch"
      }
      $variantData.Add([pscustomobject]@{
        id = [string]$variant.id
        color = $color
        size = $size
        availableInSource = ([string]$variant.available -eq "1")
        swatch = $swatchPath
        images = @($variantImagePaths)
      })
    }

    $colorImages = [System.Collections.Generic.List[object]]::new()
    $gallerySignatures = [System.Collections.Generic.List[string]]::new()
    foreach ($color in $colorOrder) {
      $paths = @($colorGroups[$color] | Sort-Object -Unique)
      $signature = $paths -join "|"
      if (-not $gallerySignatures.Contains($signature)) {
        $gallerySignatures.Add($signature)
      }
      $colorImages.Add([pscustomobject]@{ color = $color; images = $paths })
    }
    $colorSpecific = $gallerySignatures.Count -gt 1

    foreach ($cardPath in @($cardImagesByPath[$productPath])) {
      if (-not ($gallery | Where-Object { [IO.Path]::GetFileName($_.path) -eq [IO.Path]::GetFileName($cardPath) })) {
        $gallery.Add([pscustomobject]@{ url = ""; path = $cardPath; source = "OriginalProductCard" })
      }
    }

    $sourceProducts.Add([pscustomobject]@{
      id = [string]$localProduct.id
      platformId = $platformId
      name = [System.Net.WebUtility]::HtmlDecode([string]$sourceProduct.name)
      path = $productPath
      images = @($gallery)
      colors = @($colorOrder)
      sizes = @($allSizes)
      colorSpecificGalleries = $colorSpecific
      colorImages = @($colorImages)
      variants = @($variantData)
      variantTotal = $variantTotal
    })
    Write-Output "Metadados: $($sourceProduct.name) ($platformId), galeria $($gallery.Count), variantes $variantTotal."
  }

  $mediaItems = @($mediaByUrl.Values)
  $collisions = @($mediaItems | Group-Object { "$($_.productId)|$([IO.Path]::GetFileName($_.targetPath))" } | Where-Object Count -gt 1)
  if ($collisions.Count) {
    throw "Foram encontrados nomes de arquivo repetidos dentro de uma pasta de produto ($($collisions.Count) colisões)."
  }

  $failures = [System.Collections.Generic.List[object]]::new()
  $downloaded = 0
  $skipped = 0
  for ($offset = 0; $offset -lt $mediaItems.Count; $offset += $MaxWorkers) {
    $batchEnd = [Math]::Min($offset + $MaxWorkers, $mediaItems.Count)
    $batch = @($mediaItems[$offset..($batchEnd - 1)])
    $pending = [System.Collections.Generic.List[object]]::new()
    foreach ($item in $batch) {
      $directory = Split-Path -Parent $item.targetPath
      if (-not (Test-Path -LiteralPath $directory -PathType Container)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
      }
      if ((Test-Path -LiteralPath $item.targetPath -PathType Leaf) -and (Get-Item -LiteralPath $item.targetPath).Length -ge 100) {
        $skipped++
        continue
      }
      $pending.Add([pscustomobject]@{ item = $item; error = "" })
    }
    for ($attempt = 1; $attempt -le 3 -and $pending.Count; $attempt++) {
      $jobs = [System.Collections.Generic.List[object]]::new()
      foreach ($request in $pending) {
        $temporaryPath = $request.item.targetPath + ".download"
        if (Test-Path -LiteralPath $temporaryPath -PathType Leaf) {
          Remove-Item -LiteralPath $temporaryPath -Force
        }
        $job = Start-Job -ScriptBlock {
          param([string]$Url, [string]$TemporaryPath)
          $output = & curl.exe --fail --location --silent --show-error --max-time 25 --output $TemporaryPath --write-out '%{http_code}|%{content_type}' $Url 2>&1
          [pscustomobject]@{ exitCode = $LASTEXITCODE; output = ($output -join "") }
        } -ArgumentList $request.item.url, $temporaryPath
        $jobs.Add([pscustomobject]@{ item = $request.item; job = $job; temporaryPath = $temporaryPath })
      }

      Wait-Job -Job @($jobs | ForEach-Object { $_.job }) -Timeout 35 | Out-Null
      $retryItems = [System.Collections.Generic.List[object]]::new()
      foreach ($jobRecord in $jobs) {
        $errorMessage = ""
        if ($jobRecord.job.State -ne "Completed") {
          Stop-Job -Job $jobRecord.job -ErrorAction SilentlyContinue
          $errorMessage = "Tempo limite excedido ao baixar a imagem."
        } else {
          $jobOutput = @(Receive-Job -Job $jobRecord.job)
          $result = $jobOutput | Where-Object { $_.PSObject.Properties["exitCode"] } | Select-Object -Last 1
          if (-not $result -or $result.exitCode -ne 0) {
            $errorMessage = if ($result) { [string]$result.output } else { "O download não retornou um resultado válido." }
          } else {
            $details = ([string]$result.output).Split("|")
            $contentType = if ($details.Count -gt 1) { $details[$details.Count - 1] } else { "" }
            if ($details.Count -lt 2 -or $details[$details.Count - 2] -ne "200") {
              $errorMessage = "Resposta HTTP inesperada: $($result.output)"
            } elseif (-not $contentType.StartsWith("image/", [StringComparison]::OrdinalIgnoreCase)) {
              $errorMessage = "Tipo de conteúdo inesperado: $contentType"
            } elseif (-not (Test-Path -LiteralPath $jobRecord.temporaryPath -PathType Leaf) -or (Get-Item -LiteralPath $jobRecord.temporaryPath).Length -lt 100) {
              $errorMessage = "Arquivo de imagem vazio ou incompleto."
            } else {
              Move-Item -LiteralPath $jobRecord.temporaryPath -Destination $jobRecord.item.targetPath -Force
              $downloaded++
            }
          }
        }
        Remove-Job -Job $jobRecord.job -Force -ErrorAction SilentlyContinue
        if ($errorMessage) {
          if (Test-Path -LiteralPath $jobRecord.temporaryPath -PathType Leaf) {
            Remove-Item -LiteralPath $jobRecord.temporaryPath -Force
          }
          $retryItems.Add([pscustomobject]@{ item = $jobRecord.item; error = $errorMessage })
        }
      }
      $pending = $retryItems
      if ($pending.Count -and $attempt -lt 3) {
        Start-Sleep -Seconds $attempt
      }
    }
    foreach ($request in $pending) {
      $failures.Add([pscustomobject]@{ url = $request.item.url; path = $request.item.path; error = $request.error })
    }
    if ((($offset + $batch.Count) % 120) -lt $MaxWorkers -or ($offset + $batch.Count) -eq $mediaItems.Count) {
      Write-Output "Downloads processados: $([Math]::Min($offset + $batch.Count, $mediaItems.Count))/$($mediaItems.Count)."
    }
  }

  if ($failures.Count) {
    $errorPath = Join-Path $root "media-recovery-errors.json"
    ConvertTo-Json -InputObject @($failures) -Depth 5 | Set-Content -Encoding UTF8 $errorPath
  } else {
    $errorPath = Join-Path $root "media-recovery-errors.json"
    if (Test-Path -LiteralPath $errorPath -PathType Leaf) {
      Remove-Item -LiteralPath $errorPath -Force
    }
  }
  $failedPaths = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  foreach ($failure in $failures) {
    [void]$failedPaths.Add($failure.path)
  }

  foreach ($media in $mediaItems) {
    if ($failedPaths.Contains($media.path)) {
      continue
    }
    if (-not (Test-Path -LiteralPath $media.targetPath -PathType Leaf) -or (Get-Item -LiteralPath $media.targetPath).Length -lt 100) {
      throw "Verificação final falhou para $($media.path)."
    }
  }

  $manifestPath = Join-Path $root "product-media-manifest.json"
  ConvertTo-Json -InputObject @($sourceProducts) -Depth 15 | Set-Content -Encoding UTF8 $manifestPath

  $catalogMedia = foreach ($sourceProduct in $sourceProducts) {
    [pscustomobject]@{
      id = $sourceProduct.id
      platformId = $sourceProduct.platformId
      images = @($sourceProduct.images | ForEach-Object { $_.path } | Where-Object { -not $failedPaths.Contains($_) })
      colors = @($sourceProduct.colors)
      sizes = @($sourceProduct.sizes)
      colorSpecificGalleries = $sourceProduct.colorSpecificGalleries
      colorImages = @($sourceProduct.colorImages | ForEach-Object {
        [pscustomobject]@{ color = $_.color; images = @($_.images | Where-Object { -not $failedPaths.Contains($_) }) }
      })
      variants = @($sourceProduct.variants | ForEach-Object {
        [pscustomobject]@{
          id = $_.id
          color = $_.color
          size = $_.size
          availableInSource = $_.availableInSource
          swatch = if ($failedPaths.Contains($_.swatch)) { "" } else { $_.swatch }
        }
      })
    }
  }
  $catalogMediaJson = ConvertTo-Json -InputObject @($catalogMedia) -Depth 12
  $catalogMediaPath = Join-Path $root "catalog-media.js"
  [IO.File]::WriteAllText(
    $catalogMediaPath,
    "window.CATALOG_MEDIA = $catalogMediaJson;`r`n",
    [Text.UTF8Encoding]::new($false)
  )

  $galleryImages = @($sourceProducts | ForEach-Object { $_.images } | Where-Object { $_.source -eq "ProductImage" }).Count
  $variantsCount = @($sourceProducts | ForEach-Object { $_.variants }).Count
  Write-Output "Concluído: $downloaded imagens baixadas; $skipped arquivos válidos reaproveitados; $($mediaItems.Count) URLs de mídia organizados; $galleryImages fotos de galeria; $variantsCount variantes; $($failures.Count) falhas."
  if ($failures.Count) {
    Write-Output "Falhas registradas em media-recovery-errors.json; os dados locais excluem as imagens que não foram obtidas."
  }
  Write-Output "Manifesto: product-media-manifest.json"
  Write-Output "Dados para integração: catalog-media.js"
