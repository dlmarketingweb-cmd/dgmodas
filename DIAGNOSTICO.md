# Diagnóstico do catálogo local

Data da análise: 27/10/2026

## Arquivos encontrados

- Uma página HTML: `index.html` (5.469 linhas; aproximadamente 528 KB).
- Dez folhas CSS locais e vários scripts JavaScript locais da loja original.
- Uma pasta `images/` com 116 arquivos: 98 JPG, 4 JPEG, 5 PNG e 9 SVG.
- Uma pasta `fonts/` com arquivos de fontes e ícones.
- Não há páginas de categoria ou produto em HTML, nem arquivo JSON de catálogo.

## Navegação e dependências

- O HTML contém 180 links, incluindo 93 ocorrências de links para categorias/produtos. As rotas de catálogo encontradas são rotas do site original (algumas relativas e outras absolutas); não existem páginas locais correspondentes.
- Foram identificadas 13 rotas de categorias, incluindo categorias sem cartões de produto correspondentes na página inicial. Também há 33 produtos distintos nos cartões, com algumas ocorrências repetidas.
- Há links para páginas institucionais, conta, carrinho, redes sociais, mapas e outros sites. Eles não são conteúdo local do catálogo.
- A página referencia funções e endpoints Tray, incluindo `/web_api/products/variants`, preços, carrinho, busca e serviços de sessão. Esses recursos dependem da loja publicada e não fornecem, no ZIP, os dados necessários para operar offline.
- Os cartões mostram preço como “Carregando preço ...”; não há preços locais confiáveis.
- Não há páginas locais de produto, e a extração não contém um JSON de variantes/tamanhos.

## Imagens e variações

- Foram encontrados 124 elementos `<img>` na página, com 118 referências `src`/lazy-load, 111 caminhos distintos e nenhuma imagem externa nesses elementos.
- Todos os caminhos locais de imagem referenciados na página e os caminhos locais de CSS/JavaScript verificados existem.
- Os próprios cartões associam explicitamente 76 fotografias locais a 33 produtos distintos. Essas associações podem ser reaproveitadas sem inferência; as demais imagens incluem banners, conteúdo visual geral e ícones, e não devem ser atribuídas automaticamente a produtos.
- A página depende da API Tray para recuperar nomes de cores, tamanhos e imagens de variantes. Esses dados não estão incorporados no ZIP. As fotografias vinculadas a um cartão não permitem afirmar, por si só, se são cores diferentes ou ângulos do mesmo item.
- Não foram encontrados `src` de imagem externos nos elementos `<img>`. Não foi feita requisição ao fornecedor para tentar obter arquivos ou dados externos.

## Correções necessárias

1. Criar navegação local para a página inicial, as 13 categorias e os 33 produtos.
2. Construir páginas locais de categoria e detalhe, usando apenas as imagens associadas explicitamente nos cartões existentes.
3. Remover da experiência local as chamadas de carrinho, preços, sessão, rastreamento e variantes que dependem da Tray.
4. Não inventar preços, tamanhos, nomes de cores ou associações de variantes. Exibir os preços fixos cadastrados para o catálogo e sinalizar produtos sem preço ou informações de variante ausentes.
5. Não reaproveitar no novo catálogo links comerciais, institucionais ou de navegação do fornecedor.
