# Relatório de imagens e variações do catálogo

**Data da consulta:** 27/10/2026  
**Escopo:** inspeção do HTML original preservado em `backup-original/index.html`, arquivos do ZIP, dados locais do catálogo e endpoints públicos do fornecedor. Nenhuma imagem remota foi baixada durante a investigação inicial; a recuperação posterior, autorizada pela usuária, está registrada abaixo. Nenhuma restrição de acesso foi contornada.

## Importação do ZIP de lançamentos — 28/10/2026

- **Comparação:** o ZIP continha 15 produtos na página de lançamentos. Sete IDs já estavam no catálogo; oito IDs ausentes foram adicionados, sem remover ou substituir os 33 produtos existentes.
- **Produtos importados:** Trio Vanessa (9999120), Maiô Sheila (9999103), Conjunto Kassia (9977279), Saída Angelica (9899353), Vestido Vitoria (9843590), Saída Amanda (9515816), Maiô Amanda (9515814) e Conjunto Olivia (10627343).
- **Fotos:** as 16 miniaturas de cartão correspondem, pelos nomes de arquivo, às fotos de produto da origem. As galerias têm 99 referências a fotos e 96 arquivos novos únicos: três fotos idênticas compartilhadas entre Saída Amanda e Conjunto Olivia reutilizam o mesmo arquivo. Sete amostras de cor idênticas às já existentes também foram reutilizadas, sem criar cópias. Todos os caminhos citados pelo catálogo existem localmente; nenhum erro novo foi registrado em `media-recovery-errors.json`.
- **Variações obtidas na origem:** 37 combinações disponíveis de cor e tamanho, com IDs de variante e amostras de cor. Trio Vanessa: 2 cores, M/G; Maiô Sheila: 4 cores, M/G; Conjunto Kassia: 2 cores, M/G; Saída Angelica: 2 cores, M/G; Vestido Vitoria: 3 cores, M/G; Saída Amanda: 2 cores, M/G; Maiô Amanda: 2 cores, M/G; Conjunto Olivia: 3 cores, M. Não foram criadas combinações indisponíveis ou não informadas.
- **Preços iniciais da importação:** os valores publicados no ZIP e confirmados na origem foram substituídos em 29/10/2026, a pedido da loja.
- **Preços atuais definidos pela loja:** Trio Vanessa R$ 34,99; Maiô Sheila R$ 29,99; Conjunto Kassia R$ 35,99; Saída Angelica R$ 29,99; Vestido Vitoria R$ 35,99; Saída Amanda R$ 34,99; Maiô Amanda R$ 29,99; Conjunto Olivia R$ 35,99. Todos estão na faixa solicitada, de R$ 24,99 a R$ 35,99. Os valores fixos são usados na vitrine, no detalhe, no carrinho e no WhatsApp.
- **Resultado:** catálogo atualizado de 33 para 41 produtos e de 603 para 640 variantes. Os metadados completos estão em `product-media-manifest.json`; a vitrine usa `catalog-data.js` e `catalog-media.js`.

## Tipografia e título do pedido — 27/10/2026

- O título do painel da sacola foi alterado para “Seu pedido” e o texto auxiliar para “Confira sua seleção”.
- O título agora usa Montserrat com peso 600, tamanho mais equilibrado e espaçamento discreto, mantendo o painel e suas funcionalidades.

## Descontos do carrinho — 27/10/2026

- **Regra ativa:** desconto automático de 15% sobre o subtotal de produtos a partir de R$ 500,00. O valor é arredondado uma vez ao centavo, subtraído do subtotal e recalculado ao renderizar o carrinho após inclusões, remoções ou alterações de quantidade.
- **Primeira compra:** foi preparada a regra mutuamente exclusiva de 5% abaixo de R$ 500,00, mas permanece desativada (`firstPurchaseValidated = false`). Não existe validação de cadastro/histórico; não se aplicam os 5%, nem se exibe mensagem afirmando que esse benefício foi concedido. A elegibilidade deve vir de uma validação confiável no futuro, nunca de armazenamento local do navegador.
- **Resumo e WhatsApp:** exibem subtotal bruto, desconto, economia, frete como “A calcular” (com nota de faixa promocional após R$ 250,00) e total final dos produtos após desconto. Quando o frete ainda não está calculado, a mensagem informa o total de produtos mais “frete a calcular”, sem apresentar valor de frete fictício. O mesmo cálculo em centavos alimenta a sacola e o romaneio.
- **Pedido mínimo:** permanece baseado no subtotal bruto de R$ 100,00, sem alteração. A faixa de frete grátis permanece baseada no subtotal bruto de R$ 250,00.
- **Pendente:** integração futura com cadastro de cliente e histórico real de pedidos para validar a primeira compra; cálculo/consulta de frete não está integrado.
- **Testes executados:** subtotais exatos de R$ 499,99 (R$ 0,00 de desconto; total R$ 499,99), R$ 500,00 (desconto R$ 75,00; total R$ 425,00), R$ 500,01 (desconto arredondado de R$ 75,00; total R$ 425,01) e R$ 1.000,00 (desconto R$ 150,00; total R$ 850,00). Os quatro valores e a economia coincidiram entre sacola e WhatsApp. Abaixo de R$ 500,00 não foi aplicado nem anunciado o benefício de 5%. Alterar quantidade levou o subtotal de R$ 499,99 para R$ 526,73, aplicando R$ 79,01, e retornou a R$ 499,99 ao reduzir a quantidade. Remover o item cruzou para R$ 473,25, removeu o desconto e atualizou o romaneio. A sacola lateral refletiu o mesmo total. Em 320 px, mensagem, resumo, botão e gaveta couberam sem rolagem horizontal. Nenhum erro JavaScript observado; dados do carrinho de teste foram restaurados.

## Sincronização de cores e galerias — 27/10/2026

- **Auditoria:** 33 produtos, 603 variantes e 373 grupos de cor foram conferidos entre `product-media-manifest.json` (associações da API) e `catalog-media.js` (caminhos locais usados pela loja). Dos grupos de cor, 346 têm ao menos uma fotografia local associada; os caminhos renderizados nesses grupos existem no projeto.
- **Correção:** o detalhe do produto não usa mais a galeria geral como fallback quando uma cor não tem associação local. A galeria mostra apenas as fotos agrupadas para a cor selecionada, reinicia na primeira foto ao trocar a cor e apresenta “Imagem não disponível para a cor selecionada” quando não há foto mapeada. Falhas ao carregar a imagem também apresentam aviso e removem as miniaturas.
- **Carrinho:** miniatura e romaneio usam a cor selecionada e uma fotografia da galeria dessa mesma cor. Quando a cor não tem imagem local, o carrinho mostra um espaço informativo em vez de uma foto de outra cor. O ID de variante, cor e tamanho selecionados continuam salvos no item. A troca de cor mantém o tamanho escolhido quando ele é válido para a nova cor.
- **Produtos com imagens mapeadas para todas as cores (31):** Trio Loren, Biquíni Daniela, Biquíni Marquinha Fita, Trio Cintia, Biquíni Punta Cana Coração, Saia Carla, Maiô Poly, Saída Helena, Calça Búzios, Biquini Punta Cana, Saia Brisa, Biquíni Brenda, Saída Tulum, Maiô Greta, Vestido May, Vestido Tamires, Trio Elis, Body Ombro Único Lara, Body Antonia, Body Gola Manga Longa, Body Paola, Body Maju, Body Manga Longa Carla, Body Duda Regata, Body Manga Longa Isa, Biquíni Thais, Biquíni Gisela, Biquíni Beatriz, Biquíni Keyla, Biquíni Valentina e Biquini Mel.
- **Imagens pendentes (27 opções de cor em 2 produtos):**
  - Biquíni Copacabana — Azul Safira.
  - Biquíni Marquinha Viés — Laranja, Verde Lima, Tangerina, Super Pink, Lilás, Creme, Roxo, Hortelã, Azul Piscina, Azul Cobalto, Amarelo Canário com Hortelã, Hortelã com Amarelo Canário, Nude Médio, Azul Marinho com Branco, Amarelo Canário com Verde Bandeira, Rosa Barbie com Azul Piscina, Amarelo Canario, Marrom Cooca, Caramelo, Pitaya, Cinza, Verde Militar, Rosa Neon, Super Roxo, Cappuccino e Azul Petróleo.
- **Resultado da correção:** 27 opções que antes podiam cair na galeria geral agora não exibem fotos de associação desconhecida. Não foi inventado ou atribuído nenhum vínculo de imagem. O relatório de recuperação registra 102 URLs de imagens de variante que responderam HTTP 404; esses arquivos não podem ser exibidos até que sejam recuperados de uma fonte válida.
- **Testes:** os 373 grupos foram verificados contra a galeria renderizada: 346 corresponderam às fotos mapeadas e 27 exibiram o placeholder, sem falhas ou fallback. Os 603 registros de variante foram auditados; caminhos de imagem renderizáveis existem localmente. Trocas rápidas mantiveram as miniaturas e a imagem inicial corretas e preservaram P quando válido. Biquini Mel (Branco/M) foi adicionado com ID de variante, cor e imagem corretos; Biquíni Marquinha Viés (Laranja/P), sem foto mapeada, apareceu no carrinho sem fotografia e manteve a cor no WhatsApp. Subtotal e mensagem do pedido conferiram. Testes em 320 px, sem rolagem horizontal ou erros JavaScript.

## Política de trocas na página de produto — 27/10/2026

- A caixa rosa-clara abaixo do preço agora apresenta a política de trocas e devoluções da DG Modas, substituindo as notas técnicas de galeria, variante e disponibilidade.
- O WhatsApp da loja na política abre o número oficial configurado no catálogo.
- A mensagem do pedido mínimo sobre o tamanho P permanece no seletor/carrinho quando aplicável; ela é funcional e não faz parte da caixa de política.
- A última frase recebida sobre compras pela internet foi interrompida após “tamb...”; ela não foi completada nem exibida, para não inventar termos. O texto aplicado termina nos parágrafos completos enviados.

## Logo DG Modas e atualização dos preços — 27/10/2026

- **Logo:** o arquivo fornecido foi copiado sem alterações para `images/logo-dg-modas.png` e inserido no link de início do cabeçalho com proporção natural. O menu e o carrinho permanecem nos controles laterais.
- **Preços inteiros ajustados em `catalog-data.js`** (valores em todas as telas, carrinho e WhatsApp):

| Produto | Anterior | Novo |
|---|---:|---:|
| Biquíni Daniela | R$ 15,00 | R$ 14,99 |
| Biquíni Marquinha Fita | R$ 15,00 | R$ 14,99 |
| Biquíni Punta Cana Coração | R$ 15,00 | R$ 14,99 |
| Saia Carla | R$ 35,00 | R$ 34,99 |
| Maiô Poly | R$ 20,00 | R$ 19,99 |
| Saída Helena | R$ 35,00 | R$ 34,99 |
| Biquíni Copacabana | R$ 15,00 | R$ 14,99 |
| Calça Búzios | R$ 20,00 | R$ 19,99 |
| Biquíni Marquinha Viés | R$ 15,00 | R$ 14,99 |
| Biquini Punta Cana | R$ 15,00 | R$ 14,99 |
| Saia Brisa | R$ 20,00 | R$ 19,99 |
| Biquíni Brenda | R$ 15,00 | R$ 14,99 |
| Saída Tulum | R$ 30,00 | R$ 29,99 |
| Maiô Greta | R$ 20,00 | R$ 19,99 |
| Biquíni Thais | R$ 20,00 | R$ 19,99 |
| Biquíni Gisela | R$ 20,00 | R$ 19,99 |
| Biquíni Beatriz | R$ 15,00 | R$ 14,99 |
| Biquíni Keyla | R$ 20,00 | R$ 19,99 |
| Biquíni Valentina | R$ 15,00 | R$ 14,99 |
| Biquini Mel | R$ 20,00 | R$ 19,99 |
| Body Manga Longa Carla | R$ 20,00 | R$ 19,99 |
| Body Duda Regata | R$ 15,00 | R$ 14,99 |
| Body Manga Longa Isa | R$ 20,00 | R$ 19,99 |
| Trio Elis | R$ 35,00 | R$ 34,99 |
| Trio Cintia | R$ 35,00 | R$ 34,99 |

- **Preços com centavos preservados para revisão** (não alterados):

| Produto | Preço mantido |
|---|---:|
| Trio Loren | R$ 34,99 |
| Vestido May | R$ 23,47 |
| Vestido Tamires | R$ 28,63 |
| Body Ombro Único Lara | R$ 24,91 |
| Body Antonia | R$ 22,38 |
| Body Gola Manga Longa | R$ 29,16 |
| Body Paola | R$ 26,74 |
| Body Maju | R$ 21,85 |

- **Regras preservadas:** pedido mínimo de R$ 100,00, frete grátis a partir de R$ 250,00, faixas promocionais, dados e imagens dos produtos não foram alterados.
- **Testes executados:** os 33 produtos foram renderizados na home com os preços atuais, sem valores inteiros restantes; os 25 inteiros foram reduzidos em R$ 0,01 e os oito preços com centavos foram preservados. Categoria Biquínis e detalhe de Biquíni Daniela exibiram R$ 14,99; imagem principal e galeria carregaram. Pedido de 7 Biquínis Daniela e 2 Trios Cintia totalizou R$ 174,91 no carrinho e na mensagem de WhatsApp, enviada ao número oficial. Logo carregada em 1.366 px e 320 px sem distorção nem rolagem horizontal; menu e sacola abriram. Nenhum erro JavaScript observado. O cadastro de produtos/imagens foi comparado com o backup e permaneceu idêntico.

## Ajustes da faixa promocional e preços provisórios — 27/10/2026

- **Faixa roxa:** agora ocupa uma única barra de 34 px no desktop e no celular. As três mensagens alternam automaticamente a cada 3 segundos, sem controles; a troca usa transição de opacidade e é desativada quando o dispositivo solicita movimento reduzido.
- **Preços cadastrados:** foram conferidos os 33 produtos e os 26 preços fixos existentes permaneceram inalterados. Somente os sete produtos abaixo, que não tinham preço válido, receberam valores provisórios aleatórios entre R$ 20,00 e R$ 30,00. Os preços estão salvos em `window.CATALOG_FIXED_PRICES` em `catalog-data.js` e serão usados na vitrine, detalhes, carrinho e WhatsApp:
  - Vestido May — R$ 23,47
  - Vestido Tamires — R$ 28,63
  - Body Ombro Único Lara — R$ 24,91
  - Body Antonia — R$ 22,38
  - Body Gola Manga Longa — R$ 29,16
  - Body Paola — R$ 26,74
  - Body Maju — R$ 21,85
- **Revisão comercial:** todos os valores novos são provisórios e precisam ser revisados antes da publicação. O pedido mínimo de R$ 100,00 e a regra de frete permanecem sem alterações.
- **Testes:** no desktop e em 320 px, a faixa manteve 34 px, exibiu uma mensagem por vez, percorreu as três mensagens e reiniciou o ciclo sem corte nem rolagem horizontal; o carrossel ficou parado com movimento reduzido. Os sete preços apareceram na vitrine, e página de produto, carrinho e mensagem do WhatsApp usaram os valores novos. Um carrinho de R$ 120,62 teve subtotal e pedido calculados corretamente; abaixo do mínimo, o botão de checkout permaneceu desabilitado e mostrou o valor restante. Os 26 preços anteriores foram comparados com o backup e permaneceram intactos.

## Resumo

- **Produtos analisados:** 33 produtos distintos, encontrados em 38 cartões de produto na página inicial original.
- **Imagens principais locais:** 33, uma por produto, usando a primeira foto do cartão original.
- **Fotografias adicionais locais associadas aos cartões:** 43 referências além dessas 33 principais. São 76 caminhos de imagem de cartões no total; podem incluir recortes/resoluções da mesma fotografia, o que não foi confirmado visualmente.
- **Galerias expostas pela API pública do fornecedor:** 1.213 URLs de `ProductImage` (33 primeiras imagens e 1.180 entradas adicionais). Os URLs são distintos; os arquivos foram recuperados na etapa posterior descrita abaixo, mas não foram comparados visualmente para confirmar se cada um representa uma fotografia diferente.
- **Correspondências exatas por nome de arquivo entre essas galerias e `images/` no ZIP original:** 32 URLs. **URLs cujo nome exato não estava em `images/` antes da recuperação:** 1.181. Uma cópia local com outro nome, resolução ou recorte pode corresponder a algum desses arquivos; a comparação foi por nome, não visual.
- **Variantes na API:** 603 registros paginados; 272 retornaram `available=1` na consulta. Foram identificados 49 nomes distintos de cores entre esses registros disponíveis, distribuídos pelos 33 produtos. `available=1` não é confirmação independente de estoque físico.
- **Tamanhos identificados:** P, M e G, conforme a informação de SKU de cada produto. Quando a API não retornou tamanho, isso está indicado na tabela.
- **Imagens no ZIP original:** 116 arquivos em `images/` (107 raster e 9 SVG). A pasta também contém banners, ícones e imagens que não foram associados a produto sem evidência.

## Resultado da recuperação

- **Mídias consultadas:** 1.426 URLs únicos entre galerias, imagens de variantes e amostras de cor, associados aos 33 produtos.
- **Arquivos de produto locais:** 1.324 arquivos válidos em `images/products/`, organizados por ID do produto; as amostras de cor ficam em `swatches/`. Isso inclui 54 PNGs de amostra com apenas 130 bytes, confirmados como imagens válidas de 100×100.
- **Galerias principais:** os 1.213 registros `ProductImage` foram preservados e nenhum deles falhou no download. As 102 falhas restantes são respostas HTTP 404 para mídias de variantes: 97 do Biquíni Marquinha Viés e 5 do Biquíni Copacabana. Esses caminhos foram excluídos dos dados renderizados para evitar imagens quebradas.
- **Variantes integradas:** 603 registros com cor, tamanho, disponibilidade informada e amostra de cor quando baixada. As galerias por cor usam somente associações retornadas pela API. Desde a correção de 27/10/2026, quando não há foto local associada à variante, a página mostra um aviso de imagem indisponível em vez de recorrer à galeria geral.
- **Arquivos de dados:** `product-media-manifest.json` registra os metadados e caminhos de origem; `catalog-media.js` fornece à vitrine somente caminhos locais existentes; `media-recovery-errors.json` lista os 102 URLs de variante que responderam com 404.
- **Validação do catálogo:** 13 rotas de categoria e 33 páginas de produto testadas; 33/33 imagens principais carregaram; nenhum caminho renderizado aponta para arquivo ausente; seletor de cor (Trio Loren: 4 fotos para 6), tamanhos, miniatura da galeria e adição ao pedido com variação foram aprovados. Nenhum erro de JavaScript foi observado.
- **Responsividade:** início, categoria e detalhe testados em 1.366 px, 375 px e 320 px sem rolagem horizontal.
- **Categorias sem produtos locais:** Blusas, Cropped e Shorts. As rotas abrem corretamente e informam que não há cartões correspondentes nos arquivos extraídos.
- **Pendência:** 102 imagens ligadas a variantes não foram encontradas na origem (HTTP 404). Consulte `media-recovery-errors.json` para revisar os URLs e tentar novamente caso a origem os restaure; as galerias principais locais não dependem dessas imagens.

## Preços fixos do catálogo

- **Preços preservados:** os 26 valores que estavam salvos no navegador foram incorporados a `window.CATALOG_FIXED_PRICES` em `catalog-data.js`, para que sejam compartilhados pelo catálogo e não dependam do armazenamento local do navegador.
- **Edição removida:** cartões e páginas de produto exibem o preço, sem campo editável. O carrinho e a mensagem do pedido continuam usando o valor fixo configurado no catálogo.
- **Sem preço cadastrado:** Vestido May, Vestido Tamires, Body Ombro Único Lara, Body Antonia, Body Gola Manga Longa, Body Paola e Body Maju continuam sem preço, pois não havia valor salvo para esses produtos.
- **Contato (estado anterior ao ajuste de 27/10/2026):** o telefone era configurável neste dispositivo. A configuração foi substituída pelo número oficial fixo; veja “Ajustes comerciais e de interface”.

## Ajustes comerciais e de interface — 27/10/2026

- **Contato oficial:** o site usa o número fixo `5511941094836` em links de atendimento e pedidos. O carrinho não é apagado ao abrir o WhatsApp.
- **Pedido organizado:** a mensagem inclui uma seção por variação do carrinho, nome local exato, cor/tamanho, quantidade, preço unitário e subtotal; o resumo informa total de peças, subtotal e total dos produtos. Como o catálogo não calcula frete nem consulta CEP, o envio permanece “A calcular”; acima de R$ 250,00 o texto avisa que a faixa promocional foi atingida, pendente de confirmar CEP/cobertura.
- **Pedido mínimo:** a finalização fica bloqueada abaixo de R$ 100,00, com o valor restante exibido e sem impedir novas inclusões. Também é bloqueada se houver item sem preço cadastrado, pois não é possível conferir o mínimo com segurança.
- **Faixa e navegação:** adicionada a faixa com envio nacional, mínimo de R$ 100,00 e promoção de frete a partir de R$ 250,00. A navegação pública não exibe Blusas, Cropped ou Shorts, sem apagar registros. Removidos os indicadores de seta da home/menu e o botão “Explorar catálogo”.
- **Tipografia:** Montserrat aplicada à home e áreas de destaque; o cabeçalho mantém a área de texto da marca pronta para futura substituição da logo.
- **Arquivo original arquivado:** as referências antigas de R$ 400,00 aparecem somente em `backup-original/index.html`, preservado como cópia histórica do fornecedor e não carregado pelo site independente. As páginas e componentes ativos não contêm esse valor.
- **Testes desta etapa:** faixa, Montserrat carregada, menu sem setas, dez categorias públicas, 33 produtos preservados, contato e finalização apontando ao número oficial, mensagem do carrinho com variações distintas, bloqueio abaixo do mínimo, bloqueio de itens sem preço e indicação de frete pendente. Desktop e celular sem rolagem horizontal; sem erros JavaScript.

## Redesign da vitrine

- **Backup prévio:** cópia completa do projeto (1.508 arquivos) criada em `../backup-redesign-loja-20261027/` antes das alterações visuais.
- **Cabeçalho e navegação:** a antiga barra horizontal foi substituída por um botão hambúrguer que abre um painel sobreposto. No ajuste final, o menu exibe início e as 10 categorias públicas válidas. O painel fecha pelo X, pelo fundo escurecido ou pela tecla Escape e mantém a página sem rolagem enquanto está aberto. A loja estática ativa não carrega os componentes Tray `svmenu`, `svcat` ou `sideCart`; o menu e a sacola foram implementados no catálogo local.
- **Sacola:** o ícone com contador abre um painel com fotos, nome, cor/tamanho, quantidade, preço unitário e total. A remoção e as quantidades reutilizam o carrinho salvo existente; a finalização usa o número oficial configurado em “Ajustes comerciais e de interface”.
- **Categorias ilustradas:** cartões fotográficos clicáveis utilizam a primeira imagem local de produtos já classificados em cada categoria pública. Blusas, Cropped e Shorts foram removidas da navegação pública no ajuste final, sem apagar produtos ou dados.
- **Contato e responsividade:** o contato passou a ser um único ícone discreto no canto inferior direito; na página de produto, a mensagem inclui peça, cor e tamanho selecionados. O número oficial está fixo no catálogo e a finalização continua no botão da sacola. Início, categorias, produto, menu e sacola foram verificados em 1.366 px, 375 px e 320 px sem rolagem horizontal; o ícone mede 48 px no desktop e 44 px no celular.
- **Preservação e testes:** dados dos produtos, preços fixos, tamanhos, galerias, WhatsApp e carrinho foram comparados com o backup antes das alterações. Foram testados abertura/fechamento do menu (X, clique externo e Escape), navegação, carregamento das 10 fotos de categoria existentes, seleções P/M/G, inclusão, incremento, redução e remoção de itens, contador, cálculo do total e link de finalização pelo WhatsApp. Não foram observados erros JavaScript.

## Correção da seleção de tamanhos — Moda praia

- **Origem dos tamanhos:** o HTML não cadastra tamanhos. O catálogo lê `sizes` e os registros de variante em `catalog-media.js`; o manifesto detalhado é `product-media-manifest.json`. A interface e a validação de compra ficam em `catalog.js`.
- **Apresentação e cadastro local:** os 21 produtos da família Moda praia exibem P, M e G nessa ordem. P foi configurado como uma opção local nos 21 registros em `catalog-data.js`; portanto, não aparece mais como “não cadastrado” nem fica bloqueado pela ausência de um SKU da origem.
- **Disponibilidade da origem:** a API registra P na Biquíni Marquinha Fita como disponível somente nas cores Vermelho, Cinza Escuro e Amarelo, conforme `availableInSource`. Biquíni Copacabana tem P cadastrado em todas as cores, mas nenhum registro está marcado disponível. Os outros 19 produtos não têm variante P na origem. A flag da API não confirma estoque físico de forma independente.
- **Compra e pedido:** quando existe variante P da origem marcada disponível, o catálogo usa essa variante. Nos demais casos, P é enviado como tamanho solicitado localmente, sem inventar SKU ou estoque; a seleção é preservada no carrinho e na mensagem de WhatsApp, com aviso para confirmar disponibilidade antes de concluir a venda. A disponibilidade precisa ser confirmada pela lojista.
- **Produtos sem variante P na origem (registro local, sem SKU de origem):** Trio Loren; Biquíni Daniela; Biquíni Punta Cana Coração; Saia Carla; Maiô Poly; Saída Helena; Calça Búzios; Biquíni Marquinha Viés; Biquini Punta Cana; Saia Brisa; Biquíni Brenda; Saída Tulum; Maiô Greta; Biquíni Thais; Biquíni Gisela; Biquíni Beatriz; Biquíni Keyla; Biquíni Valentina; Biquini Mel.
- **Testes da correção:** as 21 páginas exibiram P, M, G e permitiram selecionar P em desktop e celular; nenhum produto apresentou rolagem horizontal no viewport móvel. Foi testado adicionar P local ao carrinho, manter P e M como itens distintos, incrementar e remover P sem afetar M, e incluir a seleção e o aviso de disponibilidade nas mensagens de WhatsApp direta e do pedido. Sem erros JavaScript; o servidor local respondeu HTTP 200. Os dados de preço foram preservados.

## O que existe no ZIP e no HTML

- O ZIP original contém uma página de loja: `index.html`. Não contém páginas HTML individuais dos produtos nem arquivos JSON de catálogo.
- Há 34 scripts JavaScript, 10 folhas CSS e 6 arquivos na pasta `fonts/`. `catalog-data.js` e `catalog.js` são arquivos do catálogo independente criado posteriormente; não fazem parte do ZIP original.
- O HTML original contém cartões com `data-product-name`, `data-product-url` e ID de produto nos blocos de preço. Os cartões mostram duas imagens locais cada; cinco produtos aparecem em mais de um cartão.
- A página inicial não contém o DOM completo das páginas de produto. Referências a seletores como `lista_cor_variacao`, `sv-foto` e `product-gallery-main` no HTML não são, por si só, uma galeria completa salva localmente.
- O JavaScript original consulta, em tempo de execução, `/web_api/products/{id}` e `/web_api/products/variants?product_id={id}&limit=50&page={n}`. O segundo endpoint é paginado. A API entrega `ProductImage`, `VariantImage`, SKU de cor/tamanho e, em vários casos, imagem de amostra de cor (`Sku.image_secure`).
- O código original reduz cada variante a uma única imagem representativa em uma das rotinas de cartão; não salva a galeria integral no HTML. As páginas individuais do fornecedor e esses endpoints públicos são a origem das imagens e das opções de variante ausentes no ZIP.
- A página pública de um produto e os endpoints de produto/variantes responderam a consultas HTTP comuns durante a análise. Não houve autenticação, contorno de bloqueio ou tentativa de baixar as imagens.

## Diagnóstico da versão original do catálogo

Antes da recuperação, o arquivo local `catalog-data.js` continha somente fotos dos cartões extraídas do HTML inicial e não incluía os registros completos de `ProductImage`, `VariantImage` ou as opções de SKU da API. A vitrine agora lê os dados gerados em `catalog-media.js`, exibe as galerias baixadas localmente e integra as cores e os tamanhos disponíveis. A grade continua usando a primeira foto como miniatura; a página de detalhe apresenta as miniaturas adicionais.

Além disso, a deduplicação dos cartões em `catalog-data.js` preservou a primeira ocorrência de cada produto. Cinco produtos têm uma segunda ocorrência no HTML com outros dois caminhos de imagem. Esses 10 caminhos estão no ZIP, mas não foram incluídos nesse arquivo de dados.

## Inventário por produto

Este inventário registra o estado do ZIP antes da recuperação. “Galeria/API” é a quantidade de URLs distintos retornados em `ProductImage` para o produto. “Não local” conta os URLs cujo nome de arquivo não existia exatamente na pasta `images/` original; não prova que não houvesse uma cópia visual equivalente com outro nome. Os links “Produto/API” e “Variantes/API” expõem os dados e URLs diretos de imagem retornados pelo fornecedor.

| Produto e ID | Principal local | Outra foto local do cartão | Galeria/API | Não local por nome | Cores disponíveis informadas pela API | Tamanhos informados |
|---|---|---|---:|---:|---|---|
| Trio Loren (`7638054`) | `images/trio_loren_1_20261015094958_3176d035f70c.jpeg` | `images/trio_loren_2_20261015094958_e29326b01043.jpeg` | 10 | 8 | Branco; Preto | G; M |
| Biquíni Daniela (`10627339`) | `images/biquni_daniela_1_20261015100303_85336e61cf47.jpeg` | `images/biquni_daniela_2_20261015100303_e547987c2320.jpeg` | 17 | 15 | Azul Capri; Chocolate Escuro; Creme; Preto; Super Pink | G; M |
| Biquíni Marquinha Fita (`10627341`) | `images/biquni_marquinha_fita_1_20261015101501_a3ee73ba9260.jpg` | `images/biquni_marquinha_fita_2_20261015101501_b72dd6e89cd8.jpg` | 24 | 22 | Amarelo; Chocolate Escuro; Cinza Escuro; Creme; Preto; Rosa Claro; Vermelho; Vinho | G; M; P |
| Trio Cintia (`10627335`) | `images/trio-feminino-tule-ukn3w.jpg` | `images/saia-longa-com-fenda-frontal-g9chc.jpg` | 14 | 12 | Azul Marinho; Preto; Rosa Claro | G; M |
| Biquíni Punta Cana Coração (`10627336`) | `images/biquini-com-detalhe-dourado-v04k7.jpg` | `images/biquini-modelagem-moderna-seymc.jpg` | 12 | 10 | Chocolate Escuro; Preto; Rosa Claro; Vermelho | G; M |
| Saia Carla (`10622904`) | `images/a020e21d-4e7d-4b9c-a426-313232e82eb1-s2faq.jpg` | `images/0c4d4ce8-cc3d-485e-b58e-e656c8558066-fwmct.jpg` | 4 | 2 | Chocolate; Creme; Preto | G; M |
| Maiô Poly (`9678081`) | `images/maio-poliamida-feminino-ga3on.jpg` | `images/maio-fio-duplo-feminino-qarxs.jpg` | 24 | 22 | Branco; Chocolate; Preto; Super Pink | G; M |
| Saída Helena (`10611121`) | `images/comprar-moda-praia-online-kovn0.jpg` | `images/comprar-saida-de-praia-atacado-bt9hm.jpg` | 17 | 15 | Creme; Preto | M |
| Biquíni Copacabana (`8181479`) | `images/atacado-moda-praia-24.jpg` | `images/super-vaidosa-atacado-bras-171.jpg` | 214 | 212 | Amarelo; Amarelo com Azul Capri; Amarelo com Rosa Claro; Azul; Azul Capri; Azul Capri com Amarelo; Azul Marinho; Branco com Preto; Chocolate; Chocolate Escuro; Chocolate Escuro com Creme; Cinza Escuro; Creme; Creme com Chocolate Escuro; Creme com Rosa Claro; Marinho com Verde Limão; Marinho com Vermelho; Preto; Rosa Bebê; Rosa Claro; Rosa Claro com Amarelo; Rosa Claro com Creme; Verde Bandeira; Verde Escuro; Verde Limão; Verde Limão com Marinho; Vermelho; Vermelho com Marinho | G; M |
| Calça Búzios (`10596187`) | `images/calca-ajuste-na-cintura-p4pyl.jpg` | `images/calca-cintura-alta-confortavel-stabg.jpg` | 13 | 11 | Branco; Pink; Preto | G; M |
| Biquíni Marquinha Viés (`6076210`) | `images/12-05k34.jpg` | `images/14-jsgoa.jpg` | 201 | 199 | Amarelo; Amarelo com Azul Capri; Amarelo com Rosa Claro; Azul; Azul Capri; Azul Capri com Amarelo; Branco; Branco com Preto; Cappuccino; Chocolate; Chocolate Escuro; Chocolate Escuro com Creme; Creme; Creme com Chocolate Escuro; Laranja Cusco; Marinho; Marinho com Verde Limão; Marinho com Vermelho; Mocha Mousse; Preto; Preto com Branco; Rosa Barbie; Rosa Bebê; Rosa Claro; Rosa Claro com Amarelo; Verde Bandeira; Verde Limão; Verde Limão com Marinho; Vermelho; Vermelho com Marinho | M |
| Biquini Punta Cana (`10558285`) | `images/biquini-poliamida-atacado-shopping-caninde-riifh.jpg` | `images/biquini-poliamida-atacado-super-vaidosa-gaoz9.jpg` | 27 | 25 | Amarelo; Azul; Azul Marinho; Chocolate Escuro; Preto; Rosa Bebê; Verde Limão; Vermelho | G; M |
| Saia Brisa (`10537949`) | `images/108-3smtt.jpg` | `images/72-r9hzs.jpg` | 47 | 45 | Amarelo; Azul; Chocolate; Rosa Bebê | M |
| Biquíni Brenda (`10512179`) | `images/84-kvs1a.jpg` | `images/87-9fwu0.jpg` | 19 | 17 | Azul; Chocolate Escuro; Creme; Preto; Rosa Bebê | G; M |
| Saída Tulum (`10489811`) | `images/14-sjugo.jpg` | `images/13-dlnbt.jpg` | 17 | 15 | Amarelo; Preto; Rosa Bebê | M |
| Maiô Greta (`10554605`) | `images/comprar-moda-praia-ohuzb.jpg` | `images/atacadista-moda-praia-pu0hn.jpg` | 44 | 42 | Amarelo com Azul; Azul com Amarelo; Branco com Preto; Chocolate Escuro com Creme; Creme com Rosa Claro; Preto com Branco | M |
| Vestido May (`10595757`) | `images/180_comprar-vestido-atacado-bras-uzvgd_450x450.jpg` | `images/180_vestido-feminino-bras-mpuyt_450x450.jpg` | 16 | 16 | Amarelo; Azul Capri; Chocolate Escuro; Preto; Rosa Claro | M |
| Vestido Tamires (`10554097`) | `images/180_atacado-de-vestido-varias-amarracoes-bt7lq_450x450.jpg` | `images/180_vestido-amarelo-no-atacado-bras-ab5ew_450x450.jpg` | 38 | 38 | Amarelo; Azul Capri; Azul Marinho; Chocolate Escuro; Preto; Vermelho | M |
| Trio Elis (`10512180`) | `images/180_biquini-de-fita-poliamida-atacado-bras-kovua_450x450.png` | `images/180_4-nnuko_450x450.jpg` | 36 | 36 | Creme; Preto; Rosa Bebê | M |
| Body Ombro Único Lara (`8285881`) | `images/180_biquini-de-fita-45_450x450.jpg` | `images/180_saida-de-praia-41_450x450.jpg` | 20 | 20 | Chocolate; Creme; Preto | M |
| Body Antonia (`6843110`) | `images/180_preto2_450x450.jpg` | `images/180_preto4_450x450.jpg` | 89 | 89 | Mocha Mousse; Rosa Barbie | M |
| Body Gola Manga Longa (`4949099`) | `images/180_3-flgmp_450x450.jpg` | `images/180_72-2_450x450.png` | 32 | 32 | Chocolate Escuro; Cinza Escuro; Creme; Verde Escuro; Vinho | Não informado |
| Body Paola (`9843591`) | `images/180_biquinis-no-atacado-10_450x450.jpg` | `images/180_loja-online-confiavel-sp-9_450x450.jpg` | 41 | 41 | Cinza Escuro; Marrom Escuro; Preto; Verde Escuro | G; M |
| Body Maju (`9189738`) | `images/180_atacadista-bras-31_450x450.jpg` | `images/180_fornecedores-atacado-bras-22_450x450.jpg` | 13 | 13 | Chocolate; Creme; Rosa Claro | M |
| Body Manga Longa Carla (`8299801`) | `images/180_moda-praia-bras-2_450x450.jpg` | `images/180_atacadista-bras_450x450.jpg` | 31 | 31 | Chocolate Escuro; Preto | M |
| Body Duda Regata (`8259618`) | `images/180_atacado-de-moda-praia-3-11_450x450.jpg` | `images/180_super-vaidosa-biquinis-em-atacado-110_450x450.jpg` | 46 | 46 | Chocolate; Chocolate Escuro; Cinza Escuro; Mocha Mousse; Preto; Verde Escuro; Vinho | G; M |
| Body Manga Longa Isa (`8348208`) | `images/180_3-uv26k_450x450.jpg` | `images/180_4-u0m42_450x450.jpg` | 14 | 14 | Mocha Mousse; Preto; Verde Escuro | M |
| Biquíni Thais (`9999031`) | `images/180_28-8_450x450.jpg` | `images/180_30-5_450x450.jpg` | 6 | 6 | Branco com Preto; Preto com Branco | G; M |
| Biquíni Gisela (`9899324`) | `images/180_loja-onlines-atacado-confiavel-12_450x450.jpg` | `images/180_23-15_450x450.jpg` | 27 | 27 | Azul Bebe com Marinho; Chocolate com Creme; Creme com Chocolate; Marinho com Azul Bebe; Rosa Pastel com Vermelho; Vermelho com Rosa Pastel | G; M |
| Biquíni Beatriz (`9820208`) | `images/180_23-12_450x450.jpg` | `images/180_24-15_450x450.jpg` | 9 | 9 | Branco; Preto; Vermelho | G; M |
| Biquíni Keyla (`9621472`) | `images/180_comprar-biquinis-online-3_450x450.jpg` | `images/180_comprar-moda-praia-online-4_450x450.jpg` | 13 | 13 | Branco; Marrom; Preto | G; M |
| Biquíni Valentina (`9324192`) | `images/180_sites-confiaveis-para-atacado-18_450x450.jpg` | `images/180_moda-praia-online-comprar-17_450x450.jpg` | 44 | 44 | Branco; Preto; Rosa Claro; Verde Bandeira | G; M |
| Biquini Mel (`7998738`) | `images/180_super-vaidosa-atacado-bras-160_450x450.jpg` | `images/180_atacadonobras-9_450x450.jpg` | 34 | 34 | Branco; Nude; Super Pink | G; M |

### URLs por produto

Os links abaixo são endpoints públicos consultados durante a análise. `Produto/API` retorna o objeto `Product`, incluindo a lista de URLs `ProductImage[].https`; `Variantes/API` retorna SKUs, cores, tamanhos e URLs `VariantImage`. Para produtos com mais de 50 registros, a resposta de variantes deve ser paginada usando `paging.total` e `page=1,2,...`.

| ID | Página pública do produto | Produto/API | Variantes/API |
|---:|---|---|---|
| 7638054 | [Trio Loren](https://www.supervaidosaatacado.com.br/moda-praia/trio-loren) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/7638054) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=7638054&limit=50&page=1) |
| 10627339 | [Biquíni Daniela](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-daniela) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10627339) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10627339&limit=50&page=1) |
| 10627341 | [Biquíni Marquinha Fita](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-marquinha-fita) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10627341) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10627341&limit=50&page=1) |
| 10627335 | [Trio Cintia](https://www.supervaidosaatacado.com.br/moda-casual/conjunto/trio-cintia) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10627335) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10627335&limit=50&page=1) |
| 10627336 | [Biquíni Punta Cana Coração](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-punta-cana-coracao-1) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10627336) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10627336&limit=50&page=1) |
| 10622904 | [Saia Carla](https://www.supervaidosaatacado.com.br/moda-praia/saida-de-praia/saia-carla) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10622904) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10622904&limit=50&page=1) |
| 9678081 | [Maiô Poly](https://www.supervaidosaatacado.com.br/moda-praia/maio/maio-poly) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9678081) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9678081&limit=50&page=1) |
| 10611121 | [Saída Helena](https://www.supervaidosaatacado.com.br/moda-praia/saida-de-praia/saida-crochet-tulum-longa-fenda-atacado) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10611121) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10611121&limit=50&page=1) |
| 8181479 | [Biquíni Copacabana](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-copacabana) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/8181479) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=8181479&limit=50&page=1) |
| 10596187 | [Calça Búzios](https://www.supervaidosaatacado.com.br/moda-praia/calca-buzios) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10596187) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10596187&limit=50&page=1) |
| 6076210 | [Biquíni Marquinha Viés](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-marquinha-vies) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/6076210) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=6076210&limit=50&page=1) |
| 10558285 | [Biquini Punta Cana](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-punta-cana) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10558285) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10558285&limit=50&page=1) |
| 10537949 | [Saia Brisa](https://www.supervaidosaatacado.com.br/moda-praia/saia-brisa) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10537949) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10537949&limit=50&page=1) |
| 10512179 | [Biquíni Brenda](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-brenda) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10512179) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10512179&limit=50&page=1) |
| 10489811 | [Saída Tulum](https://www.supervaidosaatacado.com.br/moda-praia/saida-de-praia/saida-tulum) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10489811) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10489811&limit=50&page=1) |
| 10554605 | [Maiô Greta](https://www.supervaidosaatacado.com.br/moda-praia/maio/maio-greta-1) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10554605) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10554605&limit=50&page=1) |
| 10595757 | [Vestido May](https://www.supervaidosaatacado.com.br/moda-casual/vestido-curto-alcas-finas-decote-quadrado) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10595757) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10595757&limit=50&page=1) |
| 10554097 | [Vestido Tamires](https://www.supervaidosaatacado.com.br/moda-casual/vestido-tamires) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10554097) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10554097&limit=50&page=1) |
| 10512180 | [Trio Elis](https://www.supervaidosaatacado.com.br/moda-casual/conjunto/trio-elis) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/10512180) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=10512180&limit=50&page=1) |
| 8285881 | [Body Ombro Único Lara](https://www.supervaidosaatacado.com.br/moda-casual/body-ombro-unico-lara) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/8285881) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=8285881&limit=50&page=1) |
| 6843110 | [Body Antonia](https://www.supervaidosaatacado.com.br/moda-casual/body-antonia) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/6843110) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=6843110&limit=50&page=1) |
| 4949099 | [Body Gola Manga Longa](https://www.supervaidosaatacado.com.br/moda-casual/body-gola-manga-longa) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/4949099) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=4949099&limit=50&page=1) |
| 9843591 | [Body Paola](https://www.supervaidosaatacado.com.br/moda-casual/body/body-paola) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9843591) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9843591&limit=50&page=1) |
| 9189738 | [Body Maju](https://www.supervaidosaatacado.com.br/moda-casual/body/body-maju) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9189738) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9189738&limit=50&page=1) |
| 8299801 | [Body Manga Longa Carla](https://www.supervaidosaatacado.com.br/moda-casual/body-manga-longa-carla) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/8299801) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=8299801&limit=50&page=1) |
| 8259618 | [Body Duda Regata](https://www.supervaidosaatacado.com.br/moda-casual/body-duda-regata) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/8259618) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=8259618&limit=50&page=1) |
| 8348208 | [Body Manga Longa Isa](https://www.supervaidosaatacado.com.br/moda-casual/body-manga-longa-isa) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/8348208) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=8348208&limit=50&page=1) |
| 9999031 | [Biquíni Thais](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-thais) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9999031) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9999031&limit=50&page=1) |
| 9899324 | [Biquíni Gisela](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-gisela) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9899324) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9899324&limit=50&page=1) |
| 9820208 | [Biquíni Beatriz](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-beatriz) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9820208) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9820208&limit=50&page=1) |
| 9621472 | [Biquíni Keyla](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-keyla) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9621472) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9621472&limit=50&page=1) |
| 9324192 | [Biquíni Valentina](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-valentina) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/9324192) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=9324192&limit=50&page=1) |
| 7998738 | [Biquini Mel](https://www.supervaidosaatacado.com.br/moda-praia/biquini/biquini-mel) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/7998738) | [JSON](https://www.supervaidosaatacado.com.br/web_api/products/variants?product_id=7998738&limit=50&page=1) |

## Imagens locais adicionais em cartões repetidos

Estas cinco páginas de produto aparecem em mais de um bloco da página inicial. A segunda ocorrência contém outros caminhos locais além das duas imagens usadas na primeira ocorrência em `catalog-data.js`:

- **Biquíni Copacabana:** `images/180_atacado-moda-praia-24_450x450.jpg`; `images/180_super-vaidosa-atacado-bras-171_450x450.jpg`.
- **Calça Búzios:** `images/180_calca-ajuste-na-cintura-p4pyl_450x450.jpg`; `images/180_calca-cintura-alta-confortavel-stabg_450x450.jpg`.
- **Biquini Punta Cana:** `images/180_biquini-poliamida-atacado-shopping-caninde-riifh_450x450.jpg`; `images/180_biquini-poliamida-atacado-super-vaidosa-gaoz9_450x450.jpg`.
- **Saia Brisa:** `images/180_108-3smtt_450x450.jpg`; `images/180_72-r9hzs_450x450.jpg`.
- **Maiô Greta:** `images/180_atacadista-moda-praia-pu0hn_450x450.jpg`; `images/180_comprar-moda-praia-ohuzb_450x450.jpg`.

Os nomes e vínculos acima vêm dos cartões de produto do HTML. Os nomes de arquivo diferentes não provam que sejam fotografias distintas das versões sem prefixo `180_`. Não houve deduplicação perceptual. A comparação por SHA-256 das imagens raster locais não encontrou arquivos byte a byte idênticos, mas isso não descarta recortes ou compressões da mesma foto.

## Exemplo de URL de imagem ausente

Para o Biquíni Daniela, a API lista, entre outras, a imagem `biquni_daniela_3_20261015100303_00fe9c9b1dc1.jpeg`, ausente localmente pelo nome exato:

<https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_3_20261015100303_00fe9c9b1dc1.jpeg>

Os links `Produto/API` da tabela anterior expõem a lista completa `ProductImage[].https` de cada produto; os links `Variantes/API` expõem `VariantImage` e os valores de SKU. Os 1.181 URLs não encontrados pelo nome exato são externos, hospedados no CDN `images.tcdn.com.br`. Não foram baixados nem incorporados ao catálogo nesta investigação.

## Limites e recomendação

- O HTML original é uma captura da página inicial; não contém as páginas individuais nem a resposta da API que alimenta as galerias.
- A consulta de variantes associa registros a cores e tamanhos, mas respostas de imagem podem herdar a galeria geral do produto. Por isso, não é seguro atribuir automaticamente cada foto a uma cor/estampa só pelo nome do arquivo. O catálogo deve manter a galeria geral até que cada vínculo por variante seja confirmado no produto original ou nos dados de variante específicos.
- As cores acima são rótulos enviados pelo SKU da API; combinações como “Branco com Preto” não foram reinterpretadas como estampas. Não foi encontrado um campo local ou API que identifique com segurança o nome de cada estampa.
- A recomendação da investigação inicial foi obter `ProductImage` e `VariantImage` por endpoints públicos, validar os arquivos e montar um manifesto local por produto/variante, sem depender de chamadas Tray no catálogo final. Essa recuperação autorizada foi executada na etapa posterior e está resumida na seção “Resultado da recuperação”.
- Durante a investigação inicial, somente este relatório foi criado e os arquivos do site não foram alterados; a implementação e os dados de mídia foram adicionados na etapa posterior.

## URLs diretas de imagens ausentes

Lista integral dos URLs `ProductImage[].https` cujo nome de arquivo não existia exatamente em `images/` no ZIP original. Os arquivos foram recuperados posteriormente conforme o resultado acima; esta lista preserva os URLs de origem do diagnóstico. Links repetidos entre produtos são mantidos sob cada produto porque pertencem a listas de galeria distintas.

<details><summary>Trio Loren (7638054) — 8 URLs não encontrados pelo nome</summary>

- [trio_loren_10_20261015094958_8b8b365199b3.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_10_20261015094958_8b8b365199b3.jpeg)
- [trio_loren_3_20261015094958_83eb6598f953.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_3_20261015094958_83eb6598f953.jpeg)
- [trio_loren_4_20261015094958_521757c6197c.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_4_20261015094958_521757c6197c.jpeg)
- [trio_loren_5_20261015094958_ae46ad75cf5d.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_5_20261015094958_ae46ad75cf5d.jpeg)
- [trio_loren_6_20261015094958_09075d52822b.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_6_20261015094958_09075d52822b.jpeg)
- [trio_loren_7_20261015094958_261d3e12be74.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_7_20261015094958_261d3e12be74.jpeg)
- [trio_loren_8_20261015094958_feef0bf1fd81.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_8_20261015094958_feef0bf1fd81.jpeg)
- [trio_loren_9_20261015094958_c2c8f38c2355.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/trio_loren_9_20261015094958_c2c8f38c2355.jpeg)

</details>

<details><summary>Biquíni Daniela (10627339) — 15 URLs não encontrados pelo nome</summary>

- [biquni_daniela_10_20261015100303_1ef4ac9f01ba.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_10_20261015100303_1ef4ac9f01ba.jpeg)
- [biquni_daniela_11_20261015100303_68ab1e858ec4.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_11_20261015100303_68ab1e858ec4.jpeg)
- [biquni_daniela_12_20261015100303_448fc60452ce.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_12_20261015100303_448fc60452ce.jpeg)
- [biquni_daniela_13_20261015100303_5c8d0c39cead.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_13_20261015100303_5c8d0c39cead.jpeg)
- [biquni_daniela_14_20261015100303_7f25f3133e3d.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_14_20261015100303_7f25f3133e3d.jpeg)
- [biquni_daniela_15_20261015100303_6ded5aff2446.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_15_20261015100303_6ded5aff2446.jpeg)
- [biquni_daniela_16_20261015100303_22460bc09b93.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_16_20261015100303_22460bc09b93.jpeg)
- [biquni_daniela_17_20261015100303_5cee0cb376f8.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_17_20261015100303_5cee0cb376f8.jpeg)
- [biquni_daniela_3_20261015100303_00fe9c9b1dc1.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_3_20261015100303_00fe9c9b1dc1.jpeg)
- [biquni_daniela_4_20261015100303_71f0ff72ba2f.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_4_20261015100303_71f0ff72ba2f.jpeg)
- [biquni_daniela_5_20261015100303_62dfe417f51c.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_5_20261015100303_62dfe417f51c.jpeg)
- [biquni_daniela_6_20261015100303_b30b23a0e02e.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_6_20261015100303_b30b23a0e02e.jpeg)
- [biquni_daniela_7_20261015100303_90e0bb4ded0c.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_7_20261015100303_90e0bb4ded0c.jpeg)
- [biquni_daniela_8_20261015100303_e0cc79a591d9.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_8_20261015100303_e0cc79a591d9.jpeg)
- [biquni_daniela_9_20261015100303_1f7c89dafb65.jpeg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_daniela_9_20261015100303_1f7c89dafb65.jpeg)

</details>

<details><summary>Biquíni Marquinha Fita (10627341) — 22 URLs não encontrados pelo nome</summary>

- [biquni_marquinha_fita_10_20261015101501_f1e5440c97be.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_10_20261015101501_f1e5440c97be.jpg)
- [biquni_marquinha_fita_11_20261015101501_515c58ecfeba.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_11_20261015101501_515c58ecfeba.jpg)
- [biquni_marquinha_fita_12_20261015101501_8c66ddec368d.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_12_20261015101501_8c66ddec368d.jpg)
- [biquni_marquinha_fita_13_20261015101501_70bfc80c521e.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_13_20261015101501_70bfc80c521e.jpg)
- [biquni_marquinha_fita_14_20261015101501_58179feef734.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_14_20261015101501_58179feef734.jpg)
- [biquni_marquinha_fita_15_20261015101501_240bedda497f.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_15_20261015101501_240bedda497f.jpg)
- [biquni_marquinha_fita_16_20261015101501_4ec11ace76af.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_16_20261015101501_4ec11ace76af.jpg)
- [biquni_marquinha_fita_17_20261015101501_58108bd68681.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_17_20261015101501_58108bd68681.jpg)
- [biquni_marquinha_fita_18_20261015101501_d8252e9785c3.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_18_20261015101501_d8252e9785c3.jpg)
- [biquni_marquinha_fita_19_20261015101501_93da4ae4a6e7.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_19_20261015101501_93da4ae4a6e7.jpg)
- [biquni_marquinha_fita_20_20261015101501_e961a073f888.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_20_20261015101501_e961a073f888.jpg)
- [biquni_marquinha_fita_21_20261015101501_5ccd81ea182d.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_21_20261015101501_5ccd81ea182d.jpg)
- [biquni_marquinha_fita_22_20261015101501_f182689480da.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_22_20261015101501_f182689480da.jpg)
- [biquni_marquinha_fita_23_20261015101501_06ebf9275564.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_23_20261015101501_06ebf9275564.jpg)
- [biquni_marquinha_fita_24_20261015101501_f73f882c32e4.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_24_20261015101501_f73f882c32e4.jpg)
- [biquni_marquinha_fita_3_20261015101501_3cdd557cf67d.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_3_20261015101501_3cdd557cf67d.jpg)
- [biquni_marquinha_fita_4_20261015101501_d2552b8da97e.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_4_20261015101501_d2552b8da97e.jpg)
- [biquni_marquinha_fita_5_20261015101501_860fda8d3a5d.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_5_20261015101501_860fda8d3a5d.jpg)
- [biquni_marquinha_fita_6_20261015101501_bc59f010f0a6.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_6_20261015101501_bc59f010f0a6.jpg)
- [biquni_marquinha_fita_7_20261015101501_0ae7b38fea06.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_7_20261015101501_0ae7b38fea06.jpg)
- [biquni_marquinha_fita_8_20261015101501_aa4508937bd9.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_8_20261015101501_aa4508937bd9.jpg)
- [biquni_marquinha_fita_9_20261015101501_6ad0b0fdc67d.jpg](https://images.tcdn.com.br/img/img_prod/1565517/biquni_marquinha_fita_9_20261015101501_6ad0b0fdc67d.jpg)

</details>

<details><summary>Trio Cintia (10627335) — 12 URLs não encontrados pelo nome</summary>

- [biquini-com-saia-atacado-suspl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-saia-atacado-suspl.jpg)
- [biquini-com-saia-de-tule-s3e6z.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-saia-de-tule-s3e6z.jpg)
- [biquini-com-saia-longa-qjyxy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-saia-longa-qjyxy.jpg)
- [biquini-saia-longa-feminino-3y9ls.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-saia-longa-feminino-3y9ls.jpg)
- [conjunto-biquini-saia-atacado-r19tt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/conjunto-biquini-saia-atacado-r19tt.jpg)
- [conjunto-com-saia-longa-e-fenda-vlmof.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/conjunto-com-saia-longa-e-fenda-vlmof.jpg)
- [moda-praia-atacado-bras-czir8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-bras-czir8.jpg)
- [moda-praia-trio-feminino-7poc0.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-trio-feminino-7poc0.jpg)
- [trio-com-fenda-lateral-b2gmy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/trio-com-fenda-lateral-b2gmy.jpg)
- [trio-feminino-atacado-tedi2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/trio-feminino-atacado-tedi2.jpg)
- [trio-feminino-com-saia-longa-yuzig.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/trio-feminino-com-saia-longa-yuzig.jpg)
- [trio-moda-praia-feminino-gkmd1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/trio-moda-praia-feminino-gkmd1.jpg)

</details>

<details><summary>Biquíni Punta Cana Coração (10627336) — 10 URLs não encontrados pelo nome</summary>

- [biquini-calcinha-fio-duplo-gwr4u.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-calcinha-fio-duplo-gwr4u.jpg)
- [biquini-coracao-atacado-bras-scduj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-coracao-atacado-bras-scduj.jpg)
- [biquini-coracao-atacado-epan3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-coracao-atacado-epan3.jpg)
- [biquini-coracao-atacado-sp-mey6i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-coracao-atacado-sp-mey6i.jpg)
- [biquini-cortininha-bojo-removivel-pcf8j.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-bojo-removivel-pcf8j.jpg)
- [biquini-cortininha-com-bojo-hncsz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-com-bojo-hncsz.jpg)
- [biquini-feminino-elegante-ckjg1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-feminino-elegante-ckjg1.jpg)
- [biquini-moda-praia-feminina-dh4v4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-feminina-dh4v4.jpg)
- [biquini-poliamida-feminino-d1d6p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-feminino-d1d6p.jpg)
- [biquini-poliamida-gts4w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-gts4w.jpg)

</details>

<details><summary>Saia Carla (10622904) — 2 URLs não encontrados pelo nome</summary>

- [img-0428-ugwxo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0428-ugwxo.jpg)
- [img-0431-xx2ew.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0431-xx2ew.jpg)

</details>

<details><summary>Maiô Poly (9678081) — 22 URLs não encontrados pelo nome</summary>

- [biquinis-no-atacado-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-no-atacado-5.jpg)
- [comprar-atacado-online-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-atacado-online-3.jpg)
- [loja-online-confiavel-sp-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-confiavel-sp-4.jpg)
- [loja-onlines-atacado-confiavel-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-onlines-atacado-confiavel-3.jpg)
- [maio-com-detalhe-dourado-5mhzv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-com-detalhe-dourado-5mhzv.jpg)
- [maio-com-metal-dourado-ed2l0.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-com-metal-dourado-ed2l0.jpg)
- [maio-com-passante-dourado-qlla7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-com-passante-dourado-qlla7.jpg)
- [maio-confortavel-feminino-9roge.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-confortavel-feminino-9roge.jpg)
- [maio-feminino-elegante-zqoxu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-feminino-elegante-zqoxu.jpg)
- [maio-feminino-poliamida-blwx2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-feminino-poliamida-blwx2.jpg)
- [maio-fio-duplo-vcx4z.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-fio-duplo-vcx4z.jpg)
- [maio-moda-praia-mzszm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-moda-praia-mzszm.jpg)
- [maio-modelagem-sofisticada-nyns5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-modelagem-sofisticada-nyns5.jpg)
- [maio-poliamida-pndbi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-poliamida-pndbi.jpg)
- [maio-tomara-que-caia-feminino-qjfb5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-tomara-que-caia-feminino-qjfb5.jpg)
- [maio-tomara-que-caia-lgddt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-tomara-que-caia-lgddt.jpg)
- [moda-praia-no-atacado-sp-bras-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-sp-bras-4.jpg)
- [moda-praia-online-comprar-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-online-comprar-4.jpg)
- [super-vaidosa-atacado-loja-online-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-loja-online-14.jpg)
- [super-vaidosa-atacado-moda-praia-135.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-praia-135.jpg)
- [super-vaidosa-e-confiavel-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-e-confiavel-16.jpg)
- [super-vaidosa-reclame-aqui-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-reclame-aqui-3.jpg)

</details>

<details><summary>Saída Helena (10611121) — 15 URLs não encontrados pelo nome</summary>

- [fabrica-de-saida-de-praia-68srr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fabrica-de-saida-de-praia-68srr.jpg)
- [fornecedor-de-saida-de-praia-d2jet.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-saida-de-praia-d2jet.jpg)
- [fornecedor-moda-praia-bras-kyfgx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-moda-praia-bras-kyfgx.jpg)
- [fornecedor-moda-praia-vjcop.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-moda-praia-vjcop.jpg)
- [loja-de-moda-praia-07iye.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-moda-praia-07iye.jpg)
- [loja-de-saida-de-praia-m6dkw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-saida-de-praia-m6dkw.jpg)
- [moda-praia-atacado-dt7y9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-dt7y9.jpg)
- [moda-praia-para-revenda-xzaie.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-para-revenda-xzaie.jpg)
- [saida-de-praia-atacado-0p851.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-atacado-0p851.jpg)
- [saida-de-praia-feminina-mx3ww.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-feminina-mx3ww.jpg)
- [saida-de-praia-moderna-hg9mb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-moderna-hg9mb.jpg)
- [saida-de-praia-para-biquini-cgag3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-para-biquini-cgag3.jpg)
- [saida-de-praia-para-lojistas-5fxpr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-para-lojistas-5fxpr.jpg)
- [saida-de-praia-para-revenda-tlvar.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-para-revenda-tlvar.jpg)
- [saida-de-praia-sao-paulo-pxj1p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-sao-paulo-pxj1p.jpg)

</details>

<details><summary>Biquíni Copacabana (8181479) — 212 URLs não encontrados pelo nome</summary>

- [36-fnl14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/36-fnl14.jpg)
- [37-gmdvb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/37-gmdvb.jpg)
- [38-r1mbk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/38-r1mbk.jpg)
- [39-utsbg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/39-utsbg.jpg)
- [40-dzjbq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/40-dzjbq.jpg)
- [40-rdirg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/40-rdirg.jpg)
- [41-20ui0.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/41-20ui0.jpg)
- [41-ogpb1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/41-ogpb1.jpg)
- [42-2e3jc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/42-2e3jc.jpg)
- [42-edrfg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/42-edrfg.jpg)
- [43-f95io.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/43-f95io.jpg)
- [43-tbeww.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/43-tbeww.jpg)
- [44-eqmxc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/44-eqmxc.jpg)
- [44-pbusc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/44-pbusc.jpg)
- [45-brmri.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/45-brmri.jpg)
- [45-pnfye.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/45-pnfye.jpg)
- [46-a6wzo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/46-a6wzo.jpg)
- [46-bd2ni.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/46-bd2ni.jpg)
- [4-74.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-74.jpg)
- [47-5lzwc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/47-5lzwc.jpg)
- [47-jq2sx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/47-jq2sx.jpg)
- [48-fmbic.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/48-fmbic.jpg)
- [48-je4em.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/48-je4em.jpg)
- [49-6fouq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/49-6fouq.jpg)
- [49-yimiu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/49-yimiu.jpg)
- [50-sklfd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/50-sklfd.jpg)
- [50-sockn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/50-sockn.jpg)
- [51-8s6ce.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/51-8s6ce.jpg)
- [51-wmfbu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/51-wmfbu.jpg)
- [52-hbqvi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/52-hbqvi.jpg)
- [52-s33m5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/52-s33m5.jpg)
- [53-dobta.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/53-dobta.jpg)
- [53-y4pvr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/53-y4pvr.jpg)
- [54-c3nvv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/54-c3nvv.jpg)
- [54-mtvsv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/54-mtvsv.jpg)
- [55-fthyf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55-fthyf.jpg)
- [55-kabla.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55-kabla.jpg)
- [55-uv8vx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55-uv8vx.jpg)
- [5-67.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-67.jpg)
- [56-dpn7y.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/56-dpn7y.jpg)
- [56-hnv57.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/56-hnv57.jpg)
- [56-lgjyk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/56-lgjyk.jpg)
- [57-arle1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/57-arle1.jpg)
- [57-up47p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/57-up47p.jpg)
- [58-yjrvi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/58-yjrvi.jpg)
- [59-hmrnk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/59-hmrnk.jpg)
- [60-a8z7c.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/60-a8z7c.jpg)
- [61-vdptu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/61-vdptu.jpg)
- [62-ayhed.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/62-ayhed.jpg)
- [63-yd3d5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/63-yd3d5.jpg)
- [64-uq1og.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/64-uq1og.jpg)
- [6-56.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-56.jpg)
- [65-lt4pc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/65-lt4pc.jpg)
- [66-crcds.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/66-crcds.jpg)
- [67-4bpyq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/67-4bpyq.jpg)
- [68-k1i1i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/68-k1i1i.jpg)
- [69-ur9kd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/69-ur9kd.jpg)
- [7-51.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-51.jpg)
- [8-39.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-39.jpg)
- [atacadista-bras-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadista-bras-10.jpg)
- [atacadista-bras-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadista-bras-8.jpg)
- [atacado-biquinis-28.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-biquinis-28.jpg)
- [atacado-biquinis-30.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-biquinis-30.jpg)
- [atacado-bras-101.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-101.jpg)
- [atacado-bras-104.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-104.jpg)
- [atacado-bras-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-14.jpg)
- [atacado-bras-21.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-21.jpg)
- [atacado-bras-25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-25.jpg)
- [atacado-bras-56.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-56.jpg)
- [atacado-bras-online-31.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-online-31.jpg)
- [atacado-bras-online-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-online-7.jpg)
- [atacado-bras-sp-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-sp-7.jpg)
- [atacado-de-biquini-no-bras-gnu3s.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-biquini-no-bras-gnu3s.jpg)
- [atacado-de-biquini-online-7feir.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-biquini-online-7feir.jpg)
- [atacado-de-biquinis-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-biquinis-2.jpg)
- [atacado-de-moda-praia-19.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-19.png)
- [atacado-de-moda-praia-2-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-2-6.jpg)
- [atacado-de-moda-praia-3-24.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-3-24.jpg)
- [atacado-de-moda-praia-3-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-3-6.jpg)
- [atacado-de-moda-praia-57.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-57.jpg)
- [atacado-de-moda-praia-58.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-58.jpg)
- [atacado-de-moda-praia-81.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-81.jpg)
- [atacado-de-moda-praia-cnl4n.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-cnl4n.jpg)
- [atacado-de-moda-praia-e-moda-casual-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-e-moda-casual-20.jpg)
- [atacado-moda-praia-26.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-26.jpg)
- [atacadonobras-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadonobras-23.jpg)
- [atacadonobras-25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadonobras-25.jpg)
- [atacado-no-bras-de-moda-praia-61.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-no-bras-de-moda-praia-61.jpg)
- [atacado-no-bras-de-moda-praia-67.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-no-bras-de-moda-praia-67.jpg)
- [biquini-amarracao-costas-mqh2z.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-amarracao-costas-mqh2z.jpg)
- [biquini-amarracao-nas-costas-uxidb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-amarracao-nas-costas-uxidb.jpg)
- [biquini-amarracao-nas-costas-xtyig.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-amarracao-nas-costas-xtyig.jpg)
- [biquini-amarracao-no-pescoco-mwlas.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-amarracao-no-pescoco-mwlas.jpg)
- [biquini-atacado-2-35.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-2-35.jpg)
- [biquini-atacado-3-31.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-3-31.jpg)
- [biquini-atacado-42.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-42.jpg)
- [biquini-atacado-60.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-60.jpg)
- [biquini-atacado-66.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-66.jpg)
- [biquini-atacado-68.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-68.jpg)
- [biquini-atacado-71.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-71.jpg)
- [biquini-atacado-bras-jhygz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-bras-jhygz.jpg)
- [biquini-atacado-bras-wwk9w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-bras-wwk9w.jpg)
- [biquini-atacado-online-sv-yjiri.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-online-sv-yjiri.jpg)
- [biquini-atacado-sp-sjlvn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-sp-sjlvn.jpg)
- [biquini-com-amarracao-pescoco-mwato.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-amarracao-pescoco-mwato.jpg)
- [biquini-com-bojo-uml7g.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-bojo-uml7g.jpg)
- [biquini-copacabana-atacado-02vtp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-atacado-02vtp.jpg)
- [biquini-copacabana-bojo-removivel-i2abz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-bojo-removivel-i2abz.jpg)
- [biquini-copacabana-cortininha-i799x.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-cortininha-i799x.jpg)
- [biquini-copacabana-cortininha-zigxo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-cortininha-zigxo.jpg)
- [biquini-copacabana-nky7d.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-nky7d.jpg)
- [biquini-copacabana-para-revenda-orksk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-para-revenda-orksk.jpg)
- [biquini-copacabana-poliamida-iy3b2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-poliamida-iy3b2.jpg)
- [biquini-copacabana-poliamida-nal3q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-poliamida-nal3q.jpg)
- [biquini-copacabana-super-vaidosa-0vmif.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-copacabana-super-vaidosa-0vmif.jpg)
- [biquini-cortininha-bojo-removivel-eld0w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-bojo-removivel-eld0w.jpg)
- [biquini-cortininha-bojo-removivel-yxlnd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-bojo-removivel-yxlnd.jpg)
- [biquini-cortininha-para-revenda-aiv0s.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-para-revenda-aiv0s.jpg)
- [biquini-cortininha-semi-fio-982cl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-semi-fio-982cl.jpg)
- [biquini-cortininha-w7cme.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-w7cme.jpg)
- [biquini-da-super-vaidosa.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-da-super-vaidosa.jpg)
- [biquini-de-fita-37.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-37.jpg)
- [biquini-de-fita-no-atacado-21.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-no-atacado-21.jpg)
- [biquini-de-fita-no-atacado-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-no-atacado-22.jpg)
- [biquini-de-fita-no-atacado-25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-no-atacado-25.jpg)
- [biquini-em-atacado-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-em-atacado-1.jpg)
- [biquini-fio-dental.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-fio-dental.jpg)
- [biquini-marquinha.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha.jpg)
- [biquini-marquinha-atacado-egzgn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-atacado-egzgn.jpg)
- [biquini-marquinha-dmcvs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-dmcvs.jpg)
- [biquini-marquinha-em-atacado-s0tti.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-em-atacado-s0tti.jpg)
- [biquini-moda-praia-atacado-kqnzw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-atacado-kqnzw.jpg)
- [biquini-moda-praia-atacado-oubqu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-atacado-oubqu.jpg)
- [biquini-moda-praia-bras-f0s3w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-bras-f0s3w.jpg)
- [biquini-moda-praia-feminina-lbaif.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-feminina-lbaif.jpg)
- [biquini-modelagem-classica-2-fpf8b.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-modelagem-classica-2-fpf8b.jpg)
- [biquini-modelagem-classica-eozmh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-modelagem-classica-eozmh.jpg)
- [biquini-no-bras-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-no-bras-1.jpg)
- [biquini-para-lojistas-lq6ud.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-lojistas-lq6ud.jpg)
- [biquinis-atacado-30.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-atacado-30.jpg)
- [biquinis-atacado-33.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-atacado-33.jpg)
- [biquinis-das-blogueiras.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-das-blogueiras.jpg)
- [biquinis-em-alta.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-em-alta.jpg)
- [biquini-semi-fio-em1lh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-semi-fio-em1lh.jpg)
- [biquinis-hotpant.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-hotpant.jpg)
- [biquinis-no-atacado.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-no-atacado.jpg)
- [biquinis-para-vender.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-para-vender.jpg)
- [biquini-sv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-sv.jpg)
- [biquini-top-cortininhaa-8usgx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-top-cortininhaa-8usgx.jpg)
- [comprar-biquini-copacabana-online-8gk0l.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-copacabana-online-8gk0l.jpg)
- [comprar-biquini-copacabana-online-ktl3r.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-copacabana-online-ktl3r.jpg)
- [comprar-biquini-cortininha-ewqkh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-cortininha-ewqkh.jpg)
- [comprar-biquini-cortininha-vpuvp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-cortininha-vpuvp.jpg)
- [comprar-biquini-no-atacado-nijlf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-no-atacado-nijlf.jpg)
- [comprar-biquini-no-atacado-shvkr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-no-atacado-shvkr.jpg)
- [comprar-biquini-no-bras-syvoj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-no-bras-syvoj.jpg)
- [conjunto-para-praia-25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/conjunto-para-praia-25.jpg)
- [conjunto-para-praia-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/conjunto-para-praia-8.jpg)
- [cortininha-bojo-removivel-aeb0m.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/cortininha-bojo-removivel-aeb0m.jpg)
- [fabrica-biquini-bras-kpujv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fabrica-biquini-bras-kpujv.jpg)
- [fabrica-de-biquini-ovee2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fabrica-de-biquini-ovee2.jpg)
- [fornecedor-biquini-bras-rgg5u.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-biquini-bras-rgg5u.jpg)
- [fornecedor-biquini-sao-paulo-zkghy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-biquini-sao-paulo-zkghy.jpg)
- [fornecedor-de-biquini-1.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini-1.png)
- [fornecedor-de-biquini-vz3lp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini-vz3lp.jpg)
- [fornecedores-atacado-bras-30.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-atacado-bras-30.jpg)
- [fornecedores-atacado-bras-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-atacado-bras-6.jpg)
- [hotpant-biquini-17.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/hotpant-biquini-17.jpg)
- [hotpant-biquini-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/hotpant-biquini-20.jpg)
- [hotpant-biquini-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/hotpant-biquini-4.jpg)
- [hotpant-biquini-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/hotpant-biquini-5.jpg)
- [loja-de-atacado-27.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-atacado-27.jpg)
- [loja-de-biquini-atacado-4xc7w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-biquini-atacado-4xc7w.jpg)
- [lojinha-do-bras-sp-como-comprar-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-20.jpg)
- [lojinha-do-bras-sp-como-comprar-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-23.jpg)
- [lojinha-do-bras-sp-como-comprar-3-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-3-4.jpg)
- [moda-atacado-bras-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-atacado-bras-7.jpg)
- [moda-bras-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-bras-10.jpg)
- [moda-bras-17.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-bras-17.jpg)
- [moda-casual-bras-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-casual-bras-10.jpg)
- [moda-praia-atacadista-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacadista-16.jpg)
- [moda-praia-atacadista-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacadista-4.jpg)
- [moda-praia-atacado-adacy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-adacy.jpg)
- [moda-praia-atacado-lunii.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-lunii.jpg)
- [moda-praia-atacado-no-bras-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-no-bras-6.jpg)
- [moda-praia-atacado-para-lojista-i4tyt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-para-lojista-i4tyt.jpg)
- [moda-praia-atacado-sp-24.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-sp-24.jpg)
- [moda-praia-atacado-sp-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-sp-3.jpg)
- [moda-praia-em-atacado-102.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-102.jpg)
- [moda-praia-em-atacado-79.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-79.jpg)
- [moda-praia-em-atacado-bras-e-regiao-45.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-bras-e-regiao-45.jpg)
- [moda-praia-em-atacado-bras-e-regiao-59.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-bras-e-regiao-59.jpg)
- [moda-praia-no-atacado-bras-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-bras-4.jpg)
- [roupas-em-atacado-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-em-atacado-23.jpg)
- [saida-de-praia-33.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-33.jpg)
- [saida-de-praia-34.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-34.jpg)
- [saida-de-praia-no-atacado-2-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-no-atacado-2-9.jpg)
- [saida-de-praia-no-atacado-39.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-no-atacado-39.jpg)
- [super-vaidosa-atacadista-de-biquinis-82.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacadista-de-biquinis-82.jpg)
- [super-vaidosa-atacado-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-23.jpg)
- [super-vaidosa-atacado-bras-173.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-173.jpg)
- [super-vaidosa-atacado-bras-e-regiao-2-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-2-1.jpg)
- [super-vaidosa-atacado-bras-e-regiao-54.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-54.jpg)
- [super-vaidosa-atacado-bras-e-regiao-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-7.jpg)
- [super-vaidosa-atacado-de-biquinis-177.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-177.jpg)
- [super-vaidosa-atacado-de-biquinis-178.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-178.jpg)
- [super-vaidosa-atacado-de-biquinis-179.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-179.jpg)
- [super-vaidosa-biquinis-em-atacado-106.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-biquinis-em-atacado-106.jpg)
- [super-vaidosa-biquinis-em-atacado-124.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-biquinis-em-atacado-124.jpg)
- [sva-moda-academia-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sva-moda-academia-11.jpg)
- [sv-super-vaidosa-atacado-de-biquini-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sv-super-vaidosa-atacado-de-biquini-11.jpg)
- [whatsapp-image-2025-08-05-at-094351-2.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2025-08-05-at-094351-2.jpeg)

</details>

<details><summary>Calça Búzios (10596187) — 11 URLs não encontrados pelo nome</summary>

- [calca-casual-feminina-v4nar.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-casual-feminina-v4nar.jpg)
- [calca-cintura-alta-atacado-w4hdh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-cintura-alta-atacado-w4hdh.jpg)
- [calca-cintura-alta-com-cordao-hz17p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-cintura-alta-com-cordao-hz17p.jpg)
- [calca-cintura-alta-xelzf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-cintura-alta-xelzf.jpg)
- [calca-com-ajuste-na-cintura-gkd2k.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-com-ajuste-na-cintura-gkd2k.jpg)
- [calca-com-cordao-wpu5v.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-com-cordao-wpu5v.jpg)
- [calca-feminina-atacado-vghpi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-feminina-atacado-vghpi.jpg)
- [calca-feminina-cintura-alta-nwbq9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-feminina-cintura-alta-nwbq9.jpg)
- [calca-feminina-com-cordao-ariba.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-feminina-com-cordao-ariba.jpg)
- [calca-feminina-confortavel-kcup8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-feminina-confortavel-kcup8.jpg)
- [calca-moda-feminina-aqtoa.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/calca-moda-feminina-aqtoa.jpg)

</details>

<details><summary>Biquíni Marquinha Viés (6076210) — 199 URLs não encontrados pelo nome</summary>

- [10-18tlv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-18tlv.jpg)
- [10-op9iy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-op9iy.jpg)
- [11-pgcwi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-pgcwi.jpg)
- [11-tvbr4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-tvbr4.jpg)
- [12-3msox.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/12-3msox.jpg)
- [13-shnl8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/13-shnl8.jpg)
- [14-qlemr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/14-qlemr.jpg)
- [15-4rxdc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/15-4rxdc.jpg)
- [16-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/16-15.jpg)
- [16-qipqf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/16-qipqf.jpg)
- [16-xt1af.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/16-xt1af.jpg)
- [17-arz33.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/17-arz33.jpg)
- [17-vvv5i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/17-vvv5i.jpg)
- [18-hhyfl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/18-hhyfl.jpg)
- [18-qjasz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/18-qjasz.jpg)
- [19-ugb6k.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/19-ugb6k.jpg)
- [20-12jsr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/20-12jsr.jpg)
- [20-5qwyu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/20-5qwyu.jpg)
- [21-hl41e.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/21-hl41e.jpg)
- [21-jzki3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/21-jzki3.jpg)
- [22-2e06p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/22-2e06p.jpg)
- [22-9fwws.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/22-9fwws.jpg)
- [23-r58pk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/23-r58pk.jpg)
- [24-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-8.jpg)
- [24-ptadg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-ptadg.jpg)
- [25-3gj7n.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/25-3gj7n.jpg)
- [26-bssak.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/26-bssak.jpg)
- [27-ogpe7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/27-ogpe7.jpg)
- [28-yiohi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-yiohi.jpg)
- [29-mqqmw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/29-mqqmw.jpg)
- [2-zfjpx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-zfjpx.jpg)
- [30-qmtpj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/30-qmtpj.jpg)
- [31-6x4vb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/31-6x4vb.jpg)
- [32-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/32-2.jpg)
- [32-glqk1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/32-glqk1.jpg)
- [33-sx7os.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/33-sx7os.jpg)
- [34-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/34-3.jpg)
- [34-bucxz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/34-bucxz.jpg)
- [35-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/35-1.jpg)
- [35-qhx3w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/35-qhx3w.jpg)
- [36-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/36-2.jpg)
- [36-vostu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/36-vostu.jpg)
- [37.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/37.jpg)
- [37-mywfj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/37-mywfj.jpg)
- [38.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/38.jpg)
- [38-lmoub.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/38-lmoub.jpg)
- [39.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/39.jpg)
- [3-a3z64.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-a3z64.jpg)
- [40.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/40.jpg)
- [4-75.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-75.jpg)
- [4-mwsm2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-mwsm2.jpg)
- [52-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/52-2.jpg)
- [54-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/54-1.jpg)
- [55-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55-1.jpg)
- [5-68.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-68.jpg)
- [5-pq2ev.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-pq2ev.jpg)
- [6-2zx6q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-2zx6q.jpg)
- [6-57.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-57.jpg)
- [7-52.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-52.jpg)
- [7-dqtik.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-dqtik.jpg)
- [8-40.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-40.jpg)
- [8-uvpyh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-uvpyh.jpg)
- [9-37.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-37.jpg)
- [9-nnjr6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-nnjr6.jpg)
- [9-xepjo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-xepjo.jpg)
- [atacado-de-moda-praia-e-moda-casual-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-e-moda-casual-19.jpg)
- [atacado-de-moda-praia-se0od.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-se0od.jpg)
- [atacado-e-varejo-moda-fitness-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-e-varejo-moda-fitness-2.jpg)
- [atacado-fitness-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-fitness-5.jpg)
- [atacado-moda-praia-bras-d5kwu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-bras-d5kwu.jpg)
- [atacado-moda-praia-em-atacado-bras-i5dra.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-em-atacado-bras-i5dra.jpg)
- [atacado-moda-praia-site-wzpjr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-site-wzpjr.jpg)
- [biquini-ajuste-regulavel-bvjcy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-ajuste-regulavel-bvjcy.jpg)
- [biquini-ajuste-regulavel-qrnoy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-ajuste-regulavel-qrnoy.jpg)
- [biquini-amarelo-fediz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-amarelo-fediz.jpg)
- [biquini-atacado-bras-6xahc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-bras-6xahc.jpg)
- [biquini-atacado-super-vaidosa-3kbkq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-super-vaidosa-3kbkq.jpg)
- [biquini-azul-marinho-6lyje.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-azul-marinho-6lyje.jpg)
- [biquini-bras-j0hep.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-bras-j0hep.jpg)
- [biquini-calcinha-fita-zlh3t.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-calcinha-fita-zlh3t.jpg)
- [biquini-calcinha-regulavel-m0pyd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-calcinha-regulavel-m0pyd.jpg)
- [biquini-colado-ajy0o.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-colado-ajy0o.jpg)
- [biquini-com-regulagem-lateral-bdyua.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-regulagem-lateral-bdyua.jpg)
- [biquini-com-regulagem-lateral-rykq5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-com-regulagem-lateral-rykq5.jpg)
- [biquini-confortavel-feminino-ji12q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-confortavel-feminino-ji12q.jpg)
- [biquini-confortavel-feminino-mol0s.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-confortavel-feminino-mol0s.jpg)
- [biquini-cortininha-5quec.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-5quec.jpg)
- [biquini-cortininha-atacado-2ywma.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-atacado-2ywma.jpg)
- [biquini-cortininha-atacado-tl4q3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-atacado-tl4q3.jpg)
- [biquini-cortininha-bras-8228h.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-bras-8228h.jpg)
- [biquini-cortininha-com-regulagem-qmnht.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-com-regulagem-qmnht.jpg)
- [biquini-cortininha-feminino-n0mkp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-feminino-n0mkp.jpg)
- [biquini-cortininha-para-revenda-wn4qc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-para-revenda-wn4qc.jpg)
- [biquini-cortininha-poliamida-vppq9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-cortininha-poliamida-vppq9.jpg)
- [biquini-de-marquinha-com-amarracao-evpaa.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-marquinha-com-amarracao-evpaa.jpg)
- [biquini-feminino-atacado-k8yyx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-feminino-atacado-k8yyx.jpg)
- [biquini-feminino-atacado-regvp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-feminino-atacado-regvp.jpg)
- [biquini-fio-dental-cpmvw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-fio-dental-cpmvw.jpg)
- [biquini-fita-para-sol-lym3t.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-fita-para-sol-lym3t.jpg)
- [biquini-fita-regulavel-gwsvw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-fita-regulavel-gwsvw.jpg)
- [biquini-fita-regulavel-z8dxs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-fita-regulavel-z8dxs.jpg)
- [biquini-marquinha-em-atacado-bras-p1tla.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-em-atacado-bras-p1tla.jpg)
- [biquini-marquinha-em-atacado-tsrtf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-em-atacado-tsrtf.jpg)
- [biquini-marquinha-vies-pcg14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-vies-pcg14.jpg)
- [biquini-marquinha-vies-sol-qlrwd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-vies-sol-qlrwd.jpg)
- [biquini-marquinha-vies-vermelho-x7548.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-marquinha-vies-vermelho-x7548.jpg)
- [biquini-moda-praia-atacado-b4k7j.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-atacado-b4k7j.jpg)
- [biquini-moda-praia-atacado-zc5df.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-atacado-zc5df.jpg)
- [biquini-moda-praia-culdm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-culdm.jpg)
- [biquini-moda-praia-feminina-bwf7i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-feminina-bwf7i.jpg)
- [biquini-moda-praia-nt1qj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-nt1qj.jpg)
- [biquini-modelagem-versatil-fe4eu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-modelagem-versatil-fe4eu.jpg)
- [biquini-modelagem-versatil-lview.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-modelagem-versatil-lview.jpg)
- [biquini-para-lojistas-2-9aw3i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-lojistas-2-9aw3i.jpg)
- [biquini-para-lojistas-7masu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-lojistas-7masu.jpg)
- [biquini-para-marquinha-tlsne.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-marquinha-tlsne.jpg)
- [biquini-para-pegar-sol-3rgcw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-pegar-sol-3rgcw.jpg)
- [biquini-para-pegar-sol-em-atacado-q16my.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-pegar-sol-em-atacado-q16my.jpg)
- [biquini-para-tomar-sol-marquinha-vies-isbys.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-para-tomar-sol-marquinha-vies-isbys.jpg)
- [biquini-poliamida-atacado-bras-marquinha-preto-5ynul.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-bras-marquinha-preto-5ynul.jpg)
- [biquini-poliamida-atacado-cortininha-marquinha-fita-uufcn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-cortininha-marquinha-fita-uufcn.jpg)
- [biquini-poliamida-atacado-marquinha-vies-ik47y.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-marquinha-vies-ik47y.jpg)
- [biquini-poliamida-atacado-rjjuk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-rjjuk.jpg)
- [biquini-poliamida-feminino-kvn2l.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-feminino-kvn2l.jpg)
- [biquini-poliamida-feminino-y79kb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-feminino-y79kb.jpg)
- [biquini-poliamida-xijmd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-xijmd.jpg)
- [biquini-top-cortininha-qdyuo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-top-cortininha-qdyuo.jpg)
- [biquini-verao-feminino-1nioq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-verao-feminino-1nioq.jpg)
- [como-comprar-em-loja-segura-online-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/como-comprar-em-loja-segura-online-22.jpg)
- [comprar-biquini-atacado-bras-eav4b.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-atacado-bras-eav4b.jpg)
- [comprar-biquini-cortininha-gomhq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquini-cortininha-gomhq.jpg)
- [comprar-biquinis-online-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquinis-online-2.jpg)
- [comprar-moda-praia-online-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-moda-praia-online-2.jpg)
- [fabrica-de-biquini-bras-nk7kg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fabrica-de-biquini-bras-nk7kg.jpg)
- [fitness-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fitness-4.jpg)
- [formato-para-fotos-bagy-sv-960x1280-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/formato-para-fotos-bagy-sv-960x1280-1.jpg)
- [formato-para-fotos-bagy-sv-960x1280-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/formato-para-fotos-bagy-sv-960x1280-2.jpg)
- [formato-para-fotos-bagy-sv-960x1280-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/formato-para-fotos-bagy-sv-960x1280-4.jpg)
- [fornecedor-de-biquini-atacado-fmsz7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini-atacado-fmsz7.jpg)
- [fornecedor-de-biquini-bze4q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini-bze4q.jpg)
- [img-0279-ziyzo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0279-ziyzo.jpg)
- [img-0280-jdmvt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0280-jdmvt.jpg)
- [img-0281-9wnzu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0281-9wnzu.jpg)
- [img-0299-0m2ew.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0299-0m2ew.jpg)
- [img-0300-euymw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0300-euymw.jpg)
- [img-0304-z5gdc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0304-z5gdc.jpg)
- [img-0308-k70xz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-0308-k70xz.jpg)
- [loja-fitness-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-fitness-3.jpg)
- [loja-no-bras-atacado-saaro.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-no-bras-atacado-saaro.jpg)
- [loja-no-bras-tgqqh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-no-bras-tgqqh.jpg)
- [lojas-confiaveis-no-bras-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojas-confiaveis-no-bras-3.jpg)
- [loja-segura-em-atacado-bras-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-segura-em-atacado-bras-15.jpg)
- [loja-segura-para-atacado-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-segura-para-atacado-19.jpg)
- [lojinha-do-bras-sp-como-comprar-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-12.jpg)
- [lojinha-do-bras-sp-como-comprar-2-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-2-4.jpg)
- [lojinha-do-bras-sp-como-comprar-3-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-3-2.jpg)
- [marquinha-biquini-axngw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/marquinha-biquini-axngw.jpg)
- [marquinha-vies-jkmbz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/marquinha-vies-jkmbz.jpg)
- [moda-fitness-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-2.jpg)
- [moda-fitness-academia.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-academia.jpg)
- [moda-fitness-academia-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-academia-2.jpg)
- [moda-fitness-no-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-no-bras-2.jpg)
- [moda-fitness-online-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-online-1.jpg)
- [moda-fitness-para-academia.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-para-academia.jpg)
- [moda-fitness-para-mulheres-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-fitness-para-mulheres-2.jpg)
- [moda-praia-2-inaqd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-2-inaqd.jpg)
- [moda-praia-9nd1a.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-9nd1a.jpg)
- [moda-praia-atacadista-sggw8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacadista-sggw8.jpg)
- [moda-praia-atacado-ohd8q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-ohd8q.jpg)
- [moda-praia-atacado-online-m9t2v.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-online-m9t2v.jpg)
- [moda-praia-jp7dp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-jp7dp.jpg)
- [moda-praia-marquinhas-ng1sx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-marquinhas-ng1sx.jpg)
- [moda-praia-no-bras-zrzbn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-bras-zrzbn.jpg)
- [moda-praia-sv-cefc8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-sv-cefc8.jpg)
- [moda-praia-vermelho-ffizh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-vermelho-ffizh.jpg)
- [onde-comprar-no-bras-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/onde-comprar-no-bras-6.jpg)
- [roupa-de-academia-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupa-de-academia-1.jpg)
- [roupa-de-academia-em-atacado-e-varejo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupa-de-academia-em-atacado-e-varejo.jpg)
- [roupa-de-academia-em-varejo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupa-de-academia-em-varejo.jpg)
- [roupa-fitness-no-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupa-fitness-no-bras-2.jpg)
- [roupas-em-atacado-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-em-atacado-22.jpg)
- [roupas-para-treinar-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-para-treinar-1.jpg)
- [super-vaidosa-active-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-active-1.jpg)
- [super-vaidosa-active-atacado-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-active-atacado-1.jpg)
- [super-vaidosa-atacado-30.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-30.jpg)
- [super-vaidosa-atacado-bras-e-regiao-58.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-58.jpg)
- [super-vaidosa-atacado-loja-online-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-loja-online-7.jpg)
- [super-vaidosa-atacado-moda-casual-41.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-casual-41.jpg)
- [super-vaidosa-atacado-moda-praia-128.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-praia-128.jpg)
- [super-vaidosa-atacado-sp-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-sp-7.jpg)
- [super-vaidosa-e-confiavel-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-e-confiavel-9.jpg)
- [super-vaidosa-loja-no-bras-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-loja-no-bras-8.jpg)
- [super-vaidosa-tl2uo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-tl2uo.jpg)
- [sva.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sva.jpg)
- [sva-moda-academia-25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sva-moda-academia-25.jpg)
- [sva-moda-fit.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sva-moda-fit.jpg)
- [sva-roupas-de-academia-17.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sva-roupas-de-academia-17.jpg)
- [sv-super-vaidosa-atacado-de-biquini-35.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sv-super-vaidosa-atacado-de-biquini-35.jpg)
- [top-10-sites-confiaveis-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/top-10-sites-confiaveis-3.jpg)

</details>

<details><summary>Biquini Punta Cana (10558285) — 25 URLs não encontrados pelo nome</summary>

- [biquini-em-poliamida-i4s4v.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-em-poliamida-i4s4v.jpg)
- [biquini-moda-praia-azul-marinho-4ssrk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-moda-praia-azul-marinho-4ssrk.jpg)
- [biquini-poliamida-atacado-bras-cortininha-c7w8o.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-bras-cortininha-c7w8o.jpg)
- [biquini-poliamida-atacado-bras-creme-7ouwf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-bras-creme-7ouwf.jpg)
- [biquini-poliamida-atacado-bras-mqufi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-bras-mqufi.jpg)
- [biquini-poliamida-atacado-bras-verde-pfu8e.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-bras-verde-pfu8e.jpg)
- [biquini-poliamida-atacado-bras-vermelho-k88pf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-bras-vermelho-k88pf.jpg)
- [biquini-poliamida-atacado-capuccino-jtyad.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-capuccino-jtyad.jpg)
- [biquini-poliamida-atacado-chocolate-niftu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-chocolate-niftu.jpg)
- [biquini-poliamida-atacado-com-bojo-vpwz5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-com-bojo-vpwz5.jpg)
- [biquini-poliamida-atacado-cortininha-bras-0q4as.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-cortininha-bras-0q4as.jpg)
- [biquini-poliamida-atacado-cortininha-u5jhm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-cortininha-u5jhm.jpg)
- [biquini-poliamida-atacado-creme-afx4o.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-creme-afx4o.jpg)
- [biquini-poliamida-atacado-fio-duplo-bh079.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-fio-duplo-bh079.jpg)
- [biquini-poliamida-atacado-moda-praia-56al6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-moda-praia-56al6.jpg)
- [biquini-poliamida-atacado-moda-praia-no-bras-fwmnp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-moda-praia-no-bras-fwmnp.jpg)
- [biquini-poliamida-atacado-no-bras-8k5hj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-no-bras-8k5hj.jpg)
- [biquini-poliamida-atacado-ripfe.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-ripfe.jpg)
- [biquini-poliamida-atacado-rosa-claro-e27fb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-rosa-claro-e27fb.jpg)
- [biquini-poliamida-atacado-verde-aflpp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-verde-aflpp.jpg)
- [biquini-poliamida-atacado-vermeho-yejk2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-poliamida-atacado-vermeho-yejk2.jpg)
- [biquini-preto-moda-praia-sebw2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-preto-moda-praia-sebw2.jpg)
- [biquini-punta-cana-itg6c.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-punta-cana-itg6c.jpg)
- [biquini-punta-cana-online-ab0z5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-punta-cana-online-ab0z5.jpg)
- [punta-cana-shcyk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/punta-cana-shcyk.jpg)

</details>

<details><summary>Saia Brisa (10537949) — 45 URLs não encontrados pelo nome</summary>

- [100-zwevz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/100-zwevz.jpg)
- [101-eqglz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/101-eqglz.jpg)
- [102-6duuq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/102-6duuq.jpg)
- [103-y7bk4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/103-y7bk4.jpg)
- [104-ptxxt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/104-ptxxt.jpg)
- [105-b2vrq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/105-b2vrq.jpg)
- [106-r40rr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/106-r40rr.jpg)
- [107-sgsve.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/107-sgsve.jpg)
- [109-64mna.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/109-64mna.jpg)
- [110-5g11l.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/110-5g11l.jpg)
- [111-nkrv1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/111-nkrv1.jpg)
- [112-zk4c8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/112-zk4c8.jpg)
- [113-vqvzt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/113-vqvzt.jpg)
- [114-l0ogw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/114-l0ogw.jpg)
- [115-xh4nm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/115-xh4nm.jpg)
- [116-crmee.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/116-crmee.jpg)
- [117-e3hwd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/117-e3hwd.jpg)
- [71-tcxta.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/71-tcxta.jpg)
- [73-yok3j.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/73-yok3j.jpg)
- [74-fspnh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/74-fspnh.jpg)
- [75-p2jht.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/75-p2jht.jpg)
- [76-hzxnl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/76-hzxnl.jpg)
- [77-rhi2k.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/77-rhi2k.jpg)
- [78-kerfo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/78-kerfo.jpg)
- [79-cpor0.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/79-cpor0.jpg)
- [80-knjg7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/80-knjg7.jpg)
- [81-kxyc1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/81-kxyc1.jpg)
- [82-f8aak.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/82-f8aak.jpg)
- [83-prylo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/83-prylo.jpg)
- [84-qw6iu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/84-qw6iu.jpg)
- [85-6vx4q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/85-6vx4q.jpg)
- [86-ww4ja.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/86-ww4ja.jpg)
- [87-och1y.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/87-och1y.jpg)
- [88-mchhy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/88-mchhy.jpg)
- [89-vfrsm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/89-vfrsm.jpg)
- [90-yhgmc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/90-yhgmc.jpg)
- [91-i1d3c.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/91-i1d3c.jpg)
- [92-cpozk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/92-cpozk.jpg)
- [93-6uqkx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/93-6uqkx.jpg)
- [94-b522i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/94-b522i.jpg)
- [95-exzfh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/95-exzfh.jpg)
- [96-wsooi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/96-wsooi.jpg)
- [97-beobc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/97-beobc.jpg)
- [98-n4lvd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/98-n4lvd.jpg)
- [99-hunxu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/99-hunxu.jpg)

</details>

<details><summary>Biquíni Brenda (10512179) — 17 URLs não encontrados pelo nome</summary>

- [81-csg9y.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/81-csg9y.jpg)
- [82-hzayl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/82-hzayl.jpg)
- [83-edpaf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/83-edpaf.jpg)
- [85-kkljq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/85-kkljq.jpg)
- [86-sm0uv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/86-sm0uv.jpg)
- [88-vr9n7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/88-vr9n7.jpg)
- [89-qcrvx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/89-qcrvx.jpg)
- [90-vesxp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/90-vesxp.jpg)
- [91-ldmec.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/91-ldmec.jpg)
- [92-6jlv9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/92-6jlv9.jpg)
- [93-krmk2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/93-krmk2.jpg)
- [94-jzfxy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/94-jzfxy.jpg)
- [95-ktexn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/95-ktexn.jpg)
- [96-9ixm5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/96-9ixm5.jpg)
- [97-le1oo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/97-le1oo.jpg)
- [98-nlplk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/98-nlplk.jpg)
- [99-u0v0s.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/99-u0v0s.jpg)

</details>

<details><summary>Saída Tulum (10489811) — 15 URLs não encontrados pelo nome</summary>

- [10-dbzlq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-dbzlq.jpg)
- [11-s231g.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-s231g.jpg)
- [12-mjqqc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/12-mjqqc.jpg)
- [15-nv9j0.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/15-nv9j0.jpg)
- [16-02lc7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/16-02lc7.jpg)
- [17-4mqaw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/17-4mqaw.jpg)
- [18-c8mvy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/18-c8mvy.jpg)
- [2-jwx8w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-jwx8w.jpg)
- [3-knpx2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-knpx2.jpg)
- [4-ilhlm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-ilhlm.jpg)
- [5-cdv21.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-cdv21.jpg)
- [6-804sv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-804sv.jpg)
- [7-anq8n.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-anq8n.jpg)
- [8-8vlqg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-8vlqg.jpg)
- [9-57no4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-57no4.jpg)

</details>

<details><summary>Maiô Greta (10554605) — 42 URLs não encontrados pelo nome</summary>

- [atacado-loja-de-moda-praia-7r1iy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-loja-de-moda-praia-7r1iy.jpg)
- [atacado-moda-praia-hvmx3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-hvmx3.jpg)
- [atacado-moda-praia-maio-bicolor-fbk3r.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-maio-bicolor-fbk3r.jpg)
- [atacado-no-bras-rmomb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-no-bras-rmomb.jpg)
- [atacado-super-vaidosa-le1a8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-super-vaidosa-le1a8.jpg)
- [comprar-maio-no-atacado-wvdo6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-maio-no-atacado-wvdo6.jpg)
- [comprar-no-atacado-moda-praia-maio-tt0ha.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-no-atacado-moda-praia-maio-tt0ha.jpg)
- [loja-online-de-atacado-4jdly.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-de-atacado-4jdly.jpg)
- [loja-online-szzqg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-szzqg.jpg)
- [lojas-para-comprar-no-atacado-3hmfp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojas-para-comprar-no-atacado-3hmfp.jpg)
- [maio-aberto-hhgp8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-aberto-hhgp8.jpg)
- [maio-atacadista-4mjyx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-atacadista-4mjyx.jpg)
- [maio-atacado-feirinha-qbgts.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-atacado-feirinha-qbgts.jpg)
- [maio-atacado-no-bras-pguw9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-atacado-no-bras-pguw9.jpg)
- [maio-atacado-online-bras-bkz23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-atacado-online-bras-bkz23.jpg)
- [maio-bicolor-wstcs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-bicolor-wstcs.jpg)
- [maio-branco-1gmvq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-branco-1gmvq.jpg)
- [maio-creme-com-marrom-yqku9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-creme-com-marrom-yqku9.jpg)
- [maio-creme-iatks.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-creme-iatks.jpg)
- [maio-em-atacado-5o9p2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-em-atacado-5o9p2.jpg)
- [maio-em-atacado-com-vies-2vukz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-em-atacado-com-vies-2vukz.jpg)
- [maio-estiloso-no-atacado-ooed9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-estiloso-no-atacado-ooed9.jpg)
- [maio-exclusivo-sv-mhdqr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-exclusivo-sv-mhdqr.jpg)
- [maio-exclusivo-sv-zdzwl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-exclusivo-sv-zdzwl.jpg)
- [maio-exclusivo-tawez.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-exclusivo-tawez.jpg)
- [maio-exclusivo-vyqfv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-exclusivo-vyqfv.jpg)
- [maio-marrom-com-creme-ofkaj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-marrom-com-creme-ofkaj.jpg)
- [maio-marrom-pkhyk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-marrom-pkhyk.jpg)
- [maio-no-atacado-azul-spgsd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-no-atacado-azul-spgsd.jpg)
- [maio-no-atacado-online-96q6l.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-no-atacado-online-96q6l.jpg)
- [maio-no-atacado-transpassado-wvvnj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-no-atacado-transpassado-wvvnj.jpg)
- [maio-para-praia-bjcsx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-para-praia-bjcsx.jpg)
- [maio-para-praia-moda-dzy8w.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-para-praia-moda-dzy8w.jpg)
- [maio-praia-m0i0j.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-praia-m0i0j.jpg)
- [maio-preto-com-vies-branco-o27az.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-preto-com-vies-branco-o27az.jpg)
- [maio-preto-ztl3q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-preto-ztl3q.jpg)
- [maio-vies-preto-fq2l5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-vies-preto-fq2l5.jpg)
- [maio-xgqa4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/maio-xgqa4.jpg)
- [moda-praia-atacado-maio-frsnl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-maio-frsnl.jpg)
- [moda-praia-v4u6q.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-v4u6q.jpg)
- [super-vaidosa-atacado-qwzqc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-qwzqc.jpg)
- [super-vaidosa-z92ei.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-z92ei.jpg)

</details>

<details><summary>Vestido May (10595757) — 16 URLs não encontrados pelo nome</summary>

- [comprar-vestido-atacado-bras-uzvgd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-vestido-atacado-bras-uzvgd.jpg)
- [comprar-vestido-curto-online-vyzvv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-vestido-curto-online-vyzvv.jpg)
- [comprar-vestido-feminino-8xemr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-vestido-feminino-8xemr.jpg)
- [comprar-vestido-no-atacado-qzahl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-vestido-no-atacado-qzahl.jpg)
- [comprar-vestido-poliamida-yh2si.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-vestido-poliamida-yh2si.jpg)
- [vestido-curto-atacado-sp-aveew.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-atacado-sp-aveew.jpg)
- [vestido-curto-atacado-xljhx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-atacado-xljhx.jpg)
- [vestido-curto-confortavel-s0g7p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-confortavel-s0g7p.jpg)
- [vestido-curto-feminino-jrshq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-feminino-jrshq.jpg)
- [vestido-curto-modelagem-feminina-aisxz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-modelagem-feminina-aisxz.jpg)
- [vestido-curto-para-dia-a-dia-q7une.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-para-dia-a-dia-q7une.jpg)
- [vestido-curto-poliamida-qehx0.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-curto-poliamida-qehx0.jpg)
- [vestido-feminino-atacado-kdppw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-feminino-atacado-kdppw.jpg)
- [vestido-feminino-bras-mpuyt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-feminino-bras-mpuyt.jpg)
- [vestido-feminino-poliamida-7a1x2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-feminino-poliamida-7a1x2.jpg)
- [vestido-poliamida-feminino-c4axo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-poliamida-feminino-c4axo.jpg)

</details>

<details><summary>Vestido Tamires (10554097) — 38 URLs não encontrados pelo nome</summary>

- [atacado-de-vestidos-ygocy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-vestidos-ygocy.jpg)
- [atacado-de-vestido-varias-amarracoes-bt7lq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-vestido-varias-amarracoes-bt7lq.jpg)
- [atacado-moda-casual-em-poliamida-elastano-ed24d.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-casual-em-poliamida-elastano-ed24d.jpg)
- [atacado-moda-casual-r7pyw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-casual-r7pyw.jpg)
- [atacado-moda-casual-vestidos-marrom-hesfs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-casual-vestidos-marrom-hesfs.jpg)
- [atacado-vestidos-4846u.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-vestidos-4846u.jpg)
- [loja-atacado-rua-tiers-c3ybs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-atacado-rua-tiers-c3ybs.jpg)
- [loja-no-bras-atacado-2vjsr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-no-bras-atacado-2vjsr.jpg)
- [lojas-do-bras-triez.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojas-do-bras-triez.jpg)
- [lojinha-no-bras-vwec6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-no-bras-vwec6.jpg)
- [onde-comprar-roupa-casual-o7maa.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/onde-comprar-roupa-casual-o7maa.jpg)
- [roupa-casual-de-qualidade-punju.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupa-casual-de-qualidade-punju.jpg)
- [roupas-em-atacado-esqnu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-em-atacado-esqnu.jpg)
- [vesido-no-atacado-rosa-claro-kvgkh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vesido-no-atacado-rosa-claro-kvgkh.jpg)
- [vestido-amarelo-8sejt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-amarelo-8sejt.jpg)
- [vestido-amarelo-no-atacado-bras-ab5ew.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-amarelo-no-atacado-bras-ab5ew.jpg)
- [vestido-azul-claro-zwu9t.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-azul-claro-zwu9t.jpg)
- [vestido-azul-coajy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-azul-coajy.jpg)
- [vestido-azul-marinho-ykqu7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-azul-marinho-ykqu7.jpg)
- [vestido-azul-moda-casual-2kvr6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-azul-moda-casual-2kvr6.jpg)
- [vestido-casual-chic-ac4tb.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-casual-chic-ac4tb.jpg)
- [vestido-com-decote-atacado-5uil9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-com-decote-atacado-5uil9.jpg)
- [vestido-com-fenda-atacado-sr7cn.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-com-fenda-atacado-sr7cn.jpg)
- [vestido-elegante-atacado-xnpy9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-elegante-atacado-xnpy9.jpg)
- [vestido-elegante-no-atacado-iel6z.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-elegante-no-atacado-iel6z.jpg)
- [vestido-em-elastano-hohoe.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-em-elastano-hohoe.jpg)
- [vestido-em-poliamida-2oblg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-em-poliamida-2oblg.jpg)
- [vestido-em-poliamida-atacado-marrom-bbwja.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-em-poliamida-atacado-marrom-bbwja.jpg)
- [vestido-longo-atacado-bras-fcbrf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-longo-atacado-bras-fcbrf.jpg)
- [vestido-longo-ehod2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-longo-ehod2.jpg)
- [vestido-longo-no-atacado-i891i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-longo-no-atacado-i891i.jpg)
- [vestido-marrom-moda-casual-poliamida-5f6wx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-marrom-moda-casual-poliamida-5f6wx.jpg)
- [vestido-no-atacado-bras-regiao-mej4u.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-no-atacado-bras-regiao-mej4u.jpg)
- [vestido-preto-aat2p.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-preto-aat2p.jpg)
- [vestido-rosa-no-atacado-kcgws.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestido-rosa-no-atacado-kcgws.jpg)
- [vestidos-atacado-bras-e-regiao-ghxbv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestidos-atacado-bras-e-regiao-ghxbv.jpg)
- [vestidos-no-atacado-moda-casual-no-bras-a7qvi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestidos-no-atacado-moda-casual-no-bras-a7qvi.jpg)
- [vestidos-para-o-verao-koizw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/vestidos-para-o-verao-koizw.jpg)

</details>

<details><summary>Trio Elis (10512180) — 36 URLs não encontrados pelo nome</summary>

- [10-ms64z.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-ms64z.jpg)
- [11-qpznr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-qpznr.jpg)
- [13-ymqz2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/13-ymqz2.jpg)
- [14-yqyih.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/14-yqyih.jpg)
- [15-ixo0i.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/15-ixo0i.jpg)
- [16-fa0hd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/16-fa0hd.jpg)
- [17-gfx05.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/17-gfx05.jpg)
- [18-chvgs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/18-chvgs.jpg)
- [19-cffbc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/19-cffbc.jpg)
- [1biquini-de-fita-poliamida-atacado-asslp.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/1biquini-de-fita-poliamida-atacado-asslp.png)
- [1biquini-de-fita-poliamida-atacado-cortininha-jxw9g.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/1biquini-de-fita-poliamida-atacado-cortininha-jxw9g.jpg)
- [20-vguss.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/20-vguss.jpg)
- [21-ifznk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/21-ifznk.jpg)
- [22-zsbla.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/22-zsbla.jpg)
- [23-ov7y3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/23-ov7y3.jpg)
- [24-wnlmg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-wnlmg.jpg)
- [2-5ezxa.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-5ezxa.jpg)
- [26-s9nan.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/26-s9nan.jpg)
- [27-epdpk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/27-epdpk.jpg)
- [28-zsjmf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-zsjmf.jpg)
- [29-pmo25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/29-pmo25.jpg)
- [30-k3pdw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/30-k3pdw.jpg)
- [31-whmih.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/31-whmih.jpg)
- [32-gfemw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/32-gfemw.jpg)
- [33-sbinf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/33-sbinf.jpg)
- [34-y4xw7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/34-y4xw7.jpg)
- [35-6gtjf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/35-6gtjf.jpg)
- [3-ynty4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-ynty4.jpg)
- [4-nnuko.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-nnuko.jpg)
- [5-ptzpr.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-ptzpr.jpg)
- [6-smkl2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-smkl2.jpg)
- [7-sqtko.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-sqtko.jpg)
- [8-fw6b9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-fw6b9.jpg)
- [9-gpxsu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-gpxsu.jpg)
- [biquini-de-fita-poliamida-atacado-bras-kovua.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-poliamida-atacado-bras-kovua.png)
- [biquini-de-fita-poliamida-atacado-cortininha-tj73m.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-poliamida-atacado-cortininha-tj73m.png)

</details>

<details><summary>Body Ombro Único Lara (8285881) — 20 URLs não encontrados pelo nome</summary>

- [atacado-bras-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-7.jpg)
- [atacado-de-moda-praia-2-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-2-16.jpg)
- [atacado-de-moda-praia-3-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-3-15.jpg)
- [atacado-de-moda-praia-70.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-70.jpg)
- [atacado-no-bras-de-moda-praia-54.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-no-bras-de-moda-praia-54.jpg)
- [biquini-atacado-51.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-51.jpg)
- [biquini-de-fita-45.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-45.jpg)
- [biquini-de-fita-no-atacado-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-no-atacado-6.jpg)
- [fornecedor-de-biquini-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini-6.jpg)
- [hotpant-biquini-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/hotpant-biquini-12.jpg)
- [moda-praia-atacadista-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacadista-22.jpg)
- [moda-praia-atacado-no-bras-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-no-bras-22.jpg)
- [moda-praia-atacado-sp-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-sp-14.jpg)
- [moda-praia-em-atacado-92.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-92.jpg)
- [moda-praia-em-atacado-bras-e-regiao-52.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-bras-e-regiao-52.jpg)
- [moda-praia-no-atacado-bras-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-bras-22.jpg)
- [saida-de-praia-41.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-41.jpg)
- [super-vaidosa-atacado-bras-e-regiao-2-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-2-14.jpg)
- [super-vaidosa-atacado-bras-e-regiao-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-22.jpg)
- [super-vaidosa-biquinis-em-atacado-115.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-biquinis-em-atacado-115.jpg)

</details>

<details><summary>Body Antonia (6843110) — 89 URLs não encontrados pelo nome</summary>

- [10-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-8.jpg)
- [11-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-5.jpg)
- [1-17.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/1-17.jpg)
- [12-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/12-2.jpg)
- [13-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/13-1.jpg)
- [1-32.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/1-32.jpg)
- [14-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/14-1.jpg)
- [15-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/15-1.jpg)
- [16-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/16-1.jpg)
- [17-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/17-1.jpg)
- [18-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/18-1.jpg)
- [19-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/19-1.jpg)
- [20-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/20-1.jpg)
- [21-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/21-1.jpg)
- [2-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-20.jpg)
- [22-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/22-1.jpg)
- [23-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/23-1.jpg)
- [2-35.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-35.jpg)
- [24-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-1.jpg)
- [25-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/25-1.jpg)
- [26-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/26-1.jpg)
- [27-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/27-1.jpg)
- [28-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-1.jpg)
- [29-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/29-1.jpg)
- [30-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/30-1.jpg)
- [3-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-15.jpg)
- [3-30.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-30.jpg)
- [4-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-16.jpg)
- [4-29.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-29.jpg)
- [5-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-16.jpg)
- [5-29.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-29.jpg)
- [6-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-14.jpg)
- [6-27.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-27.jpg)
- [7-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-12.jpg)
- [7-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-22.jpg)
- [8-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-10.jpg)
- [8-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-19.jpg)
- [9-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-11.jpg)
- [9-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-20.jpg)
- [atacadista-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadista-bras-2.jpg)
- [atacado-biquinis-18.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-biquinis-18.jpg)
- [atacado-biquinis-35.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-biquinis-35.jpg)
- [atacado-bras-online-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-online-2.jpg)
- [atacado-bras-sp-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-sp-2.jpg)
- [atacado-de-moda-praia-2-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-2-10.jpg)
- [atacado-de-moda-praia-3-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-3-10.jpg)
- [atacado-de-moda-praia-63.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-63.jpg)
- [atacado-de-moda-praia-e-moda-casual-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-e-moda-casual-2.jpg)
- [atacado-de-roupas-online-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-roupas-online-2.jpg)
- [atacado-moda-praia-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-16.jpg)
- [atacado-moda-praia-30.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-30.jpg)
- [atacadonobras-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadonobras-16.jpg)
- [atacadonobras-29.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadonobras-29.jpg)
- [biquini-atacado-2-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-2-19.jpg)
- [biquini-atacado-25.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-25.jpg)
- [biquini-atacado-27.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-27.jpg)
- [biquini-atacado-3-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-3-19.jpg)
- [biquini-atacado-3-36.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-3-36.jpg)
- [biquinis-atacado-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-atacado-19.jpg)
- [como-comprar-roupas-em-atacado-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/como-comprar-roupas-em-atacado-2.jpg)
- [fornecedores-atacado-bras-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-atacado-bras-1.jpg)
- [fornecedores-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-bras-2.jpg)
- [loja-de-atacado-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-atacado-2.jpg)
- [moda-atacado-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-atacado-bras-2.jpg)
- [moda-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-bras-2.jpg)
- [moda-casual-bras-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-casual-bras-3.jpg)
- [moda-praia-atacado-no-bras-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-no-bras-20.jpg)
- [moda-praia-atacado-sp-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-sp-8.jpg)
- [moda-praia-bras-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-bras-4.jpg)
- [moda-praia-em-atacado-85.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-85.jpg)
- [moda-praia-em-atacado-bras-e-regiao-48.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-bras-e-regiao-48.jpg)
- [moda-praia-no-atacado-bras-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-bras-20.jpg)
- [preto1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/preto1.jpg)
- [preto2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/preto2.jpg)
- [preto3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/preto3.jpg)
- [preto4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/preto4.jpg)
- [roupas-em-atacado-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-em-atacado-4.jpg)
- [saida-de-praia-no-atacado-24.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-no-atacado-24.jpg)
- [saida-de-praia-no-atacado-26.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-no-atacado-26.jpg)
- [super-vaidosa-atacadista-de-biquinis-87.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacadista-de-biquinis-87.jpg)
- [super-vaidosa-atacado-bras-167.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-167.jpg)
- [super-vaidosa-atacado-bras-177.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-177.jpg)
- [super-vaidosa-atacado-bras-e-regiao-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-20.jpg)
- [super-vaidosa-atacado-bras-e-regiao-42.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-42.jpg)
- [super-vaidosa-atacado-de-biquinis-188.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-188.jpg)
- [super-vaidosa-atacado-de-biquinis-189.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-189.jpg)
- [super-vaidosa-biquinis-em-atacado-65.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-biquinis-em-atacado-65.jpg)
- [sv-super-vaidosa-atacado-de-biquini-13.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sv-super-vaidosa-atacado-de-biquini-13.jpg)
- [sv-super-vaidosa-atacado-de-biquini-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sv-super-vaidosa-atacado-de-biquini-23.jpg)

</details>

<details><summary>Body Gola Manga Longa (4949099) — 32 URLs não encontrados pelo nome</summary>

- [10-uuldq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-uuldq.jpg)
- [11-bq4dh.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-bq4dh.jpg)
- [12-4dzkw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/12-4dzkw.jpg)
- [13-rwtyf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/13-rwtyf.jpg)
- [14-ybze1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/14-ybze1.jpg)
- [2-kv9pt.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-kv9pt.jpg)
- [3-flgmp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-flgmp.jpg)
- [3-ubpmi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-ubpmi.jpg)
- [4-aduym.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-aduym.jpg)
- [4-jk593.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-jk593.jpg)
- [5-cf3tx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-cf3tx.jpg)
- [5-ng6h4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-ng6h4.jpg)
- [6-tn7vy.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-tn7vy.jpg)
- [6-xk94e.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-xk94e.jpg)
- [72-2.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/72-2.png)
- [73-2.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/73-2.png)
- [74-2.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/74-2.png)
- [75-2.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/75-2.png)
- [7-iayr4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-iayr4.jpg)
- [7-vbpnw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-vbpnw.jpg)
- [8-c8bzg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-c8bzg.jpg)
- [8-fkhv9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-fkhv9.jpg)
- [9-cmgig.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-cmgig.jpg)
- [9-ctzsi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-ctzsi.jpg)
- [design-sem-nome-2024-04-29t075005327.png](https://images.tcdn.com.br/img/img_prod/bagy/140425/design-sem-nome-2024-04-29t075005327.png)
- [img-4596.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-4596.jpeg)
- [img-4597.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-4597.jpeg)
- [img-4602.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-4602.jpeg)
- [img-4603.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/img-4603.jpeg)
- [super-vaidosa-atacado-mjx92.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-mjx92.jpg)
- [whatsapp-image-2026-04-02-at-103934-f58nu.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2026-04-02-at-103934-f58nu.jpeg)
- [whatsapp-image-2026-04-02-at-104214-alynr.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2026-04-02-at-104214-alynr.jpeg)

</details>

<details><summary>Body Paola (9843591) — 41 URLs não encontrados pelo nome</summary>

- [23-13.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/23-13.jpg)
- [24-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-16.jpg)
- [25-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/25-9.jpg)
- [26-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/26-8.jpg)
- [27-6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/27-6.jpg)
- [28-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-5.jpg)
- [29-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/29-5.jpg)
- [40-g5zys.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/40-g5zys.jpg)
- [41-arqku.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/41-arqku.jpg)
- [42-5ubh6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/42-5ubh6.jpg)
- [43-5gc69.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/43-5gc69.jpg)
- [44-0m8xl.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/44-0m8xl.jpg)
- [45-s3fjg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/45-s3fjg.jpg)
- [46-kp4c8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/46-kp4c8.jpg)
- [47-0lxzs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/47-0lxzs.jpg)
- [48-wkqxw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/48-wkqxw.jpg)
- [49-zfopu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/49-zfopu.jpg)
- [50-0ihsj.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/50-0ihsj.jpg)
- [51-50gko.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/51-50gko.jpg)
- [52-x62zk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/52-x62zk.jpg)
- [53-fnyk6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/53-fnyk6.jpg)
- [54-2e45s.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/54-2e45s.jpg)
- [55-8mlgs.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55-8mlgs.jpg)
- [56-h0qp9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/56-h0qp9.jpg)
- [57-axdd6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/57-axdd6.jpg)
- [58-dtpgc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/58-dtpgc.jpg)
- [59-fbydq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/59-fbydq.jpg)
- [60-omahi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/60-omahi.jpg)
- [61-oqwf2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/61-oqwf2.jpg)
- [62-hc39k.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/62-hc39k.jpg)
- [63-0vu2y.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/63-0vu2y.jpg)
- [64-kou9z.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/64-kou9z.jpg)
- [65-vpfrf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/65-vpfrf.jpg)
- [biquinis-no-atacado-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-no-atacado-10.jpg)
- [loja-online-confiavel-sp-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-confiavel-sp-9.jpg)
- [loja-onlines-atacado-confiavel-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-onlines-atacado-confiavel-9.jpg)
- [moda-praia-no-atacado-sp-bras-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-sp-bras-9.jpg)
- [onde-comprar-no-bras-24.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/onde-comprar-no-bras-24.jpg)
- [super-vaidosa-atacado-moda-casual-61.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-casual-61.jpg)
- [super-vaidosa-atacado-moda-praia-146.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-praia-146.jpg)
- [super-vaidosa-e-onfiavel-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-e-onfiavel-8.jpg)

</details>

<details><summary>Body Maju (9189738) — 13 URLs não encontrados pelo nome</summary>

- [atacadista-bras-31.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadista-bras-31.jpg)
- [atacado-bras-81.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-81.jpg)
- [atacado-bras-online-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-online-23.jpg)
- [atacado-bras-sp-29.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-sp-29.jpg)
- [como-comprar-roupas-em-atacado-18.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/como-comprar-roupas-em-atacado-18.jpg)
- [fornecedores-atacado-bras-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-atacado-bras-22.jpg)
- [fornecedores-bras-32.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-bras-32.jpg)
- [loja-de-atacado-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-atacado-20.jpg)
- [moda-atacado-bras-23.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-atacado-bras-23.jpg)
- [moda-bras-39.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-bras-39.jpg)
- [moda-casual-bras-37.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-casual-bras-37.jpg)
- [moda-praia-bras-36.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-bras-36.jpg)
- [roupas-em-atacado-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-em-atacado-16.jpg)

</details>

<details><summary>Body Manga Longa Carla (8299801) — 31 URLs não encontrados pelo nome</summary>

- [54-0yzys.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/54-0yzys.jpg)
- [55-htq3o.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55-htq3o.jpg)
- [56-4tubg.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/56-4tubg.jpg)
- [57-p1jk2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/57-p1jk2.jpg)
- [58-nhxqk.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/58-nhxqk.jpg)
- [59-hznz8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/59-hznz8.jpg)
- [60-wvllv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/60-wvllv.jpg)
- [61-1evvw.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/61-1evvw.jpg)
- [62-idzuf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/62-idzuf.jpg)
- [63-9krap.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/63-9krap.jpg)
- [64-l5fvf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/64-l5fvf.jpg)
- [atacadista-bras.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadista-bras.jpg)
- [atacado-bras-49.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-49.jpg)
- [atacado-bras-online.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-online.jpg)
- [atacado-bras-sp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-sp.jpg)
- [atacado-de-moda-praia-e-moda-casual.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-e-moda-casual.jpg)
- [atacado-de-roupas-moda-praia-e-casual.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-roupas-moda-praia-e-casual.jpg)
- [atacado-de-roupas-online.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-roupas-online.jpg)
- [atacado-de-roupas-super-vaidosa.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-roupas-super-vaidosa.jpg)
- [como-comprar-roupas-em-atacado.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/como-comprar-roupas-em-atacado.jpg)
- [fornecedores-atacado-bras.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-atacado-bras.jpg)
- [fornecedores-bras.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedores-bras.jpg)
- [loja-de-atacado.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-de-atacado.jpg)
- [moda-atacado-bras.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-atacado-bras.jpg)
- [moda-bras.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-bras.jpg)
- [moda-casual-bras-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-casual-bras-1.jpg)
- [moda-praia-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-bras-2.jpg)
- [roupas-em-atacado-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/roupas-em-atacado-2.jpg)
- [super-vaidosa-atacado-bras-e-regiao-41.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-e-regiao-41.jpg)
- [sva-moda-academia-18.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sva-moda-academia-18.jpg)
- [sv-super-vaidosa-atacado-de-biquini-22.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sv-super-vaidosa-atacado-de-biquini-22.jpg)

</details>

<details><summary>Body Duda Regata (8259618) — 46 URLs não encontrados pelo nome</summary>

- [atacado-bras-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-1.jpg)
- [atacado-bras-2.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-2.jpg)
- [atacado-bras-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-4.jpg)
- [atacado-de-cropped.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-cropped.jpg)
- [atacado-de-moda-praia-2-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-2-11.jpg)
- [atacado-de-moda-praia-2-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-2-14.jpg)
- [atacado-de-moda-praia-3-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-3-11.jpg)
- [atacado-de-moda-praia-64.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-64.jpg)
- [atacado-de-moda-praia-67.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-de-moda-praia-67.jpg)
- [atacado-no-bras-de-moda-praia-51.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-no-bras-de-moda-praia-51.jpg)
- [biquini-atacado-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-19.jpg)
- [biquini-atacado-46.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-46.jpg)
- [biquini-atacado-48.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-48.jpg)
- [biquini-de-fita-42.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-42.jpg)
- [biquini-de-fita-no-atacado.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-no-atacado.jpg)
- [biquini-de-fita-no-atacado-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-de-fita-no-atacado-3.jpg)
- [biquinis-no-atacado-cmu13.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-no-atacado-cmu13.jpg)
- [comprar-atacado-online-mgzso.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-atacado-online-mgzso.jpg)
- [comprar-biquinis-online-0zyna.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquinis-online-0zyna.jpg)
- [comprar-moda-praia-online-vkj9l.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-moda-praia-online-vkj9l.jpg)
- [cropped-em-atacado-1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/cropped-em-atacado-1.jpg)
- [fornecedor-de-biquini.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini.jpg)
- [fornecedor-de-biquini-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/fornecedor-de-biquini-3.jpg)
- [hotpant-biquini-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/hotpant-biquini-9.jpg)
- [loja-online-confiavel-sp-se6t7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-confiavel-sp-se6t7.jpg)
- [loja-onlines-atacado-confiavel-46sm5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-onlines-atacado-confiavel-46sm5.jpg)
- [lojas-confiaveis-no-bras-f7oh6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojas-confiaveis-no-bras-f7oh6.jpg)
- [moda-praia-atacadista-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacadista-20.jpg)
- [moda-praia-atacado-sp-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-atacado-sp-9.jpg)
- [moda-praia-em-atacado-86.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-86.jpg)
- [moda-praia-em-atacado-87.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-87.jpg)
- [moda-praia-em-atacado-89.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-89.jpg)
- [moda-praia-em-atacado-bras-e-regiao-49.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-bras-e-regiao-49.jpg)
- [moda-praia-no-atacado-sp-bras-opyrz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-sp-bras-opyrz.jpg)
- [moda-praia-online-comprar-sgbhi.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-online-comprar-sgbhi.jpg)
- [onde-comprar-no-bras-xzhht.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/onde-comprar-no-bras-xzhht.jpg)
- [saida-de-praia-39.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-39.jpg)
- [sites-confiaveis-para-atacado-25jnv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sites-confiaveis-para-atacado-25jnv.jpg)
- [super-vaidosa-atacado-loja-online-sg4na.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-loja-online-sg4na.jpg)
- [super-vaidosa-atacado-moda-casual-9cw1h.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-casual-9cw1h.jpg)
- [super-vaidosa-atacado-moda-praia-faaq6.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-praia-faaq6.jpg)
- [super-vaidosa-biquinis-em-atacado-110.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-biquinis-em-atacado-110.jpg)
- [super-vaidosa-biquinis-em-atacado-113.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-biquinis-em-atacado-113.jpg)
- [super-vaidosa-e-onfiavel-ym3mu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-e-onfiavel-ym3mu.jpg)
- [super-vaidosa-reclame-aqui-6hyae.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-reclame-aqui-6hyae.jpg)
- [top-10-sites-confiaveis-fttek.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/top-10-sites-confiaveis-fttek.jpg)

</details>

<details><summary>Body Manga Longa Isa (8348208) — 14 URLs não encontrados pelo nome</summary>

- [10-gyddm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-gyddm.jpg)
- [11-1tbhm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-1tbhm.jpg)
- [12-pg6yx.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/12-pg6yx.jpg)
- [13-jukk1.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/13-jukk1.jpg)
- [14-ffuf7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/14-ffuf7.jpg)
- [15-md5gu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/15-md5gu.jpg)
- [3-uv26k.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-uv26k.jpg)
- [4-u0m42.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-u0m42.jpg)
- [5-4nhjd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-4nhjd.jpg)
- [6-ggvdz.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-ggvdz.jpg)
- [7-gujxm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-gujxm.jpg)
- [8-0eqav.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-0eqav.jpg)
- [9-32lgu.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-32lgu.jpg)
- [super-vaidosa-atacado-vum6c.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-vum6c.jpg)

</details>

<details><summary>Biquíni Thais (9999031) — 6 URLs não encontrados pelo nome</summary>

- [28-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-8.jpg)
- [29-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/29-8.jpg)
- [30-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/30-5.jpg)
- [31-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/31-5.jpg)
- [32-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/32-5.jpg)
- [33-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/33-4.jpg)

</details>

<details><summary>Biquíni Gisela (9899324) — 27 URLs não encontrados pelo nome</summary>

- [23-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/23-15.jpg)
- [24-18.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-18.jpg)
- [25-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/25-11.jpg)
- [26-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/26-10.jpg)
- [27-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/27-8.jpg)
- [28-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-7.jpg)
- [29-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/29-7.jpg)
- [2-enlqq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-enlqq.jpg)
- [30-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/30-4.jpg)
- [31-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/31-4.jpg)
- [32-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/32-4.jpg)
- [33-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/33-3.jpg)
- [34-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/34-4.jpg)
- [3-vnapv.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-vnapv.jpg)
- [4-oxsy5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-oxsy5.jpg)
- [5-uw2ho.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-uw2ho.jpg)
- [6-cpyg3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-cpyg3.jpg)
- [7-tpwpf.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-tpwpf.jpg)
- [biquinis-no-atacado-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-no-atacado-12.jpg)
- [comprar-atacado-online-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-atacado-online-12.jpg)
- [loja-online-confiavel-sp-13.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-confiavel-sp-13.jpg)
- [loja-onlines-atacado-confiavel-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-onlines-atacado-confiavel-12.jpg)
- [moda-praia-no-atacado-sp-bras-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-sp-bras-11.jpg)
- [moda-praia-online-comprar-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-online-comprar-15.jpg)
- [sites-confiaveis-para-atacado-17.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sites-confiaveis-para-atacado-17.jpg)
- [super-vaidosa-reclame-aqui-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-reclame-aqui-12.jpg)
- [top-10-sites-confiaveis-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/top-10-sites-confiaveis-19.jpg)

</details>

<details><summary>Biquíni Beatriz (9820208) — 9 URLs não encontrados pelo nome</summary>

- [23-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/23-12.jpg)
- [24-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/24-15.jpg)
- [25-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/25-8.jpg)
- [26-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/26-7.jpg)
- [27-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/27-5.jpg)
- [28-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/28-4.jpg)
- [biquinis-no-atacado-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-no-atacado-9.jpg)
- [loja-onlines-atacado-confiavel-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-onlines-atacado-confiavel-7.jpg)
- [moda-praia-no-atacado-sp-bras-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-no-atacado-sp-bras-8.jpg)

</details>

<details><summary>Biquíni Keyla (9621472) — 13 URLs não encontrados pelo nome</summary>

- [comprar-biquinis-online-3.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquinis-online-3.jpg)
- [comprar-moda-praia-online-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-moda-praia-online-4.jpg)
- [lojas-confiaveis-no-bras-4.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojas-confiaveis-no-bras-4.jpg)
- [onde-comprar-no-bras-7.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/onde-comprar-no-bras-7.jpg)
- [sites-confiaveis-para-atacado-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sites-confiaveis-para-atacado-5.jpg)
- [super-vaidosa-atacado-32.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-32.jpg)
- [super-vaidosa-atacado-loja-online-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-loja-online-8.jpg)
- [super-vaidosa-atacado-moda-casual-42.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-casual-42.jpg)
- [super-vaidosa-atacado-moda-praia-129.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-praia-129.jpg)
- [super-vaidosa-atacado-sp-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-sp-8.jpg)
- [super-vaidosa-e-confiavel-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-e-confiavel-10.jpg)
- [super-vaidosa-loja-no-bras-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-loja-no-bras-9.jpg)
- [top-10-sites-confiaveis-5.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/top-10-sites-confiaveis-5.jpg)

</details>

<details><summary>Biquíni Valentina (9324192) — 44 URLs não encontrados pelo nome</summary>

- [2-jk3zd.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-jk3zd.jpg)
- [3-e6bgp.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-e6bgp.jpg)
- [4-80.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-80.jpg)
- [4-kvotc.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-kvotc.jpg)
- [55.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/55.jpg)
- [56.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/56.jpg)
- [57.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/57.jpg)
- [5-73.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-73.jpg)
- [58.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/58.jpg)
- [59.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/59.jpg)
- [5-wlm9r.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-wlm9r.jpg)
- [60.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/60.jpg)
- [61.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/61.jpg)
- [63.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/63.jpg)
- [64.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/64.jpg)
- [65.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/65.jpg)
- [66.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/66.jpg)
- [6-68.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-68.jpg)
- [67.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/67.jpg)
- [68.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/68.jpg)
- [69.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/69.jpg)
- [6-zhwhm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-zhwhm.jpg)
- [7-bamlq.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-bamlq.jpg)
- [8-tvoar.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-tvoar.jpg)
- [comprar-atacado-online-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-atacado-online-14.jpg)
- [comprar-biquinis-online-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-biquinis-online-19.jpg)
- [comprar-moda-praia-online-19.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-moda-praia-online-19.jpg)
- [lojas-confiaveis-no-bras-24.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojas-confiaveis-no-bras-24.jpg)
- [moda-praia-online-comprar-17.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-online-comprar-17.jpg)
- [onde-comprar-no-bras-28.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/onde-comprar-no-bras-28.jpg)
- [sites-confiaveis-para-atacado-18.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sites-confiaveis-para-atacado-18.jpg)
- [super-vaidosa-atacado-61.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-61.jpg)
- [super-vaidosa-atacado-loja-online-36.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-loja-online-36.jpg)
- [super-vaidosa-atacado-moda-casual-70.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-casual-70.jpg)
- [super-vaidosa-atacado-moda-praia-154.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-moda-praia-154.jpg)
- [super-vaidosa-e-onfiavel-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-e-onfiavel-16.jpg)
- [super-vaidosa-loja-no-bras-36.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-loja-no-bras-36.jpg)
- [super-vaidosa-reclame-aqui-14.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-reclame-aqui-14.jpg)
- [super-vaidsa-atacado-sp-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidsa-atacado-sp-9.jpg)
- [top-10-sites-confiaveis-20.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/top-10-sites-confiaveis-20.jpg)
- [whatsapp-image-2025-10-02-at-142719.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2025-10-02-at-142719.jpeg)
- [whatsapp-image-2025-10-02-at-142719-1.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2025-10-02-at-142719-1.jpeg)
- [whatsapp-image-2025-10-02-at-142719-2.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2025-10-02-at-142719-2.jpeg)
- [whatsapp-image-2025-10-02-at-142720.jpeg](https://images.tcdn.com.br/img/img_prod/bagy/140425/whatsapp-image-2025-10-02-at-142720.jpeg)

</details>

<details><summary>Biquini Mel (7998738) — 34 URLs não encontrados pelo nome</summary>

- [10-34.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/10-34.jpg)
- [11-27.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/11-27.jpg)
- [2-4azts.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/2-4azts.jpg)
- [3-4dgrm.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/3-4dgrm.jpg)
- [4-vno7c.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/4-vno7c.jpg)
- [5-wzibo.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/5-wzibo.jpg)
- [6-63.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/6-63.jpg)
- [7-57.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/7-57.jpg)
- [8-45.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/8-45.jpg)
- [9-41.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/9-41.jpg)
- [atacado-biquinis-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-biquinis-11.jpg)
- [atacado-bras-110.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-bras-110.jpg)
- [atacado-moda-praia-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacado-moda-praia-9.jpg)
- [atacadonobras-9.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/atacadonobras-9.jpg)
- [biquini-atacado-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-16.jpg)
- [biquini-atacado-2-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-2-11.jpg)
- [biquini-atacado-3-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquini-atacado-3-11.jpg)
- [biquinis-atacado-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/biquinis-atacado-11.jpg)
- [comprar-atacado-online-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-atacado-online-8.jpg)
- [comprar-moda-praia-online-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/comprar-moda-praia-online-15.jpg)
- [loja-online-confiavel-sp-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/loja-online-confiavel-sp-10.jpg)
- [lojinha-do-bras-sp-como-comprar-2-12.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-2-12.jpg)
- [lojinha-do-bras-sp-como-comprar-29.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-29.jpg)
- [lojinha-do-bras-sp-como-comprar-3-10.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/lojinha-do-bras-sp-como-comprar-3-10.jpg)
- [moda-praia-em-atacado-69.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-em-atacado-69.jpg)
- [moda-praia-online-comprar-11.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/moda-praia-online-comprar-11.jpg)
- [saida-de-praia-no-atacado-16.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/saida-de-praia-no-atacado-16.jpg)
- [sites-confiaveis-para-atacado-13.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/sites-confiaveis-para-atacado-13.jpg)
- [super-vaidosa-atacadista-de-biquinis-77.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacadista-de-biquinis-77.jpg)
- [super-vaidosa-atacado-bras-160.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-bras-160.jpg)
- [super-vaidosa-atacado-de-biquinis-168.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-168.jpg)
- [super-vaidosa-atacado-de-biquinis-169.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-atacado-de-biquinis-169.jpg)
- [super-vaidosa-reclame-aqui-8.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/super-vaidosa-reclame-aqui-8.jpg)
- [top-10-sites-confiaveis-15.jpg](https://images.tcdn.com.br/img/img_prod/bagy/140425/top-10-sites-confiaveis-15.jpg)

</details>
