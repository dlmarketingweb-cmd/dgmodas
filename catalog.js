(function () {
  "use strict";

  const products = window.CATALOG_PRODUCTS;
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Os dados locais do catálogo não foram carregados.");
  }
  const mediaProducts = window.CATALOG_MEDIA;
  if (!Array.isArray(mediaProducts) || mediaProducts.length !== products.length) {
    throw new Error("Os dados locais de imagens e variantes não foram carregados.");
  }
  products.forEach(function (product) {
    const media = mediaProducts.find(function (entry) { return entry.id === product.id; });
    if (!media) throw new Error("Não há dados de mídia para o produto " + product.name + ".");
    product.platformId = media.platformId;
    product.images = media.images;
    product.colors = media.colors;
    product.sizes = media.sizes;
    product.localSizes = Array.isArray(product.localSizes) ? product.localSizes : [];
    product.colorSpecificGalleries = media.colorSpecificGalleries;
    product.colorImages = media.colorImages;
    product.variants = media.variants;
  });

  const categories = [
    { id: "moda-praia", title: "Moda praia", family: "moda-praia" },
    { id: "biquini", title: "Biquínis", category: "biquini" },
    { id: "biquini-de-fita", title: "Coleção Marquinha de Fita", category: "biquini-de-fita" },
    { id: "maio", title: "Maiôs", category: "maio" },
    { id: "saida-de-praia", title: "Saídas de praia", category: "saida-de-praia" },
    { id: "moda-casual", title: "Moda casual", family: "moda-casual" },
    { id: "body", title: "Bodys", category: "body" },
    { id: "conjunto", title: "Conjuntos e trios", category: "conjunto" },
    { id: "vestido", title: "Vestidos", category: "vestido" },
    { id: "calca", title: "Calças", category: "calca" },
    { id: "saia", title: "Saias", category: "saia" }
  ];
  const categoryImageProducts = {
    "moda-praia": "trio-loren",
    biquini: "biquini-daniela",
    maio: "maio-poly",
    "saida-de-praia": "saida-crochet-tulum-longa-fenda-atacado",
    "moda-casual": "vestido-tamires",
    body: "body-antonia",
    conjunto: "trio-loren",
    vestido: "vestido-curto-alcas-finas-decote-quadrado",
    calca: "calca-buzios",
    saia: "saia-brisa"
  };

  const app = document.getElementById("app");
  const CART_KEY = "vitrine.catalog.cart";
  const STORE_WHATSAPP = "5511941094836";
  const MINIMUM_ORDER = 100;
  const FREE_SHIPPING_THRESHOLD = 250;
  const BLACK_FRIDAY_THRESHOLD_CENTS = 50000;
  const BLACK_FRIDAY_GIFT_CENTS = 10000;
  const BEACHWEAR_SIZES = ["P", "M", "G"];
  const promoMessages = [
    "ENVIAMOS PARA TODO O BRASIL",
    "PEDIDO MÍNIMO DE R$ 100,00",
    "FRETE GRÁTIS A PARTIR DE R$ 250,00"
  ];
  let selectedImage = 0;
  let selectedColor = "";
  let selectedSize = "";
  let sizeSelectionConfirmed = false;
  let promoMessageIndex = 0;
  let activeDrawer = "";
  let drawerClosing = false;
  let promotionOpen = true;
  let scrollToPromotionCatalog = false;
  let drawerCloseTimer;
  let toastTimer;
  let promoCarouselTimer;
  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  function syncPromoCarousel() {
    window.clearInterval(promoCarouselTimer);
    promoCarouselTimer = null;
    if (!reducedMotionPreference.matches) {
      promoCarouselTimer = window.setInterval(advancePromoMessage, 3000);
    }
  }

  function advancePromoMessage() {
    const messages = app.querySelectorAll(".promo-item");
    if (messages.length !== promoMessages.length) return;
    messages[promoMessageIndex].classList.remove("is-active");
    messages[promoMessageIndex].setAttribute("aria-hidden", "true");
    promoMessageIndex = (promoMessageIndex + 1) % promoMessages.length;
    messages[promoMessageIndex].classList.add("is-active");
    messages[promoMessageIndex].setAttribute("aria-hidden", "false");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function readCart() {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("O pedido salvo localmente está inválido.");
    }
    return parsed.filter(function (item) {
      return products.some(function (product) { return product.id === item.id; }) &&
        Number.isInteger(item.quantity) && item.quantity > 0;
    });
  }

  function cartVariantKey(item) {
    return item.variantId
      ? "sku:" + item.variantId
      : "local:" + JSON.stringify([item.color || "", item.size || ""]);
  }

  function priceFor(product) {
    const fixedPrices = window.CATALOG_FIXED_PRICES;
    return Object.prototype.hasOwnProperty.call(fixedPrices, product.id)
      ? String(fixedPrices[product.id])
      : String(product.price || "");
  }

  function parsePrice(value) {
    if (value === "") return null;
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 ? amount : null;
  }

  function formatPrice(amount) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(amount);
  }

  function categoryFor(product) {
    return categories.find(function (category) {
      return category.category === product.category;
    }) || categories.find(function (category) {
      return category.id === product.family;
    });
  }

  function galleryFor(product, color) {
    if (!color) return product.images;
    const colorGallery = product.colorImages.find(function (entry) {
      return entry.color === color;
    });
    return colorGallery ? colorGallery.images : [];
  }

  function variantsForColor(product, color) {
    return product.variants.filter(function (variant) {
      return variant.color === color;
    });
  }

  function chosenVariant(product) {
    const matches = product.variants.filter(function (variant) {
      return variant.color === selectedColor && variant.size === selectedSize;
    });
    if (product.family === "moda-praia" && selectedSize === "P") {
      return matches.find(function (variant) { return variant.availableInSource; }) || null;
    }
    return matches[0] || null;
  }

  function sizeIsSelectable(product, color, size) {
    if (product.localSizes.includes(size)) return true;
    const matches = variantsForColor(product, color).filter(function (variant) {
      return variant.size === size;
    });
    if (matches.length === 0) return false;
    return product.family !== "moda-praia" || size !== "P" ||
      matches.some(function (variant) { return variant.availableInSource; });
  }

  function swatchFor(product, color) {
    const variant = product.variants.find(function (entry) {
      return entry.color === color && entry.swatch;
    });
    return variant ? variant.swatch : "";
  }

  function categoryHref(category) {
    return "#/categoria/" + category.id;
  }

  function productHref(product) {
    return "#/produto/" + product.id;
  }

  function whatsappHref(message) {
    return "https://wa.me/" + STORE_WHATSAPP + "?text=" + encodeURIComponent(message);
  }

  function header(cartCount, activeCategory) {
    return `
      <header class="site-header">
        <div class="promo-bar" aria-label="Informações comerciais" aria-live="polite" aria-atomic="true">
          ${promoMessages.map(function (message, index) {
            return `<span class="promo-item${index === promoMessageIndex ? " is-active" : ""}" aria-hidden="${index !== promoMessageIndex}">${message}</span>`;
          }).join("")}
        </div>
        <div class="header-main">
          <button class="icon-button menu-trigger" type="button" data-action="open-menu" aria-label="Abrir menu de categorias" aria-expanded="${activeDrawer === "menu"}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <a class="brand" href="#/" aria-label="DG Modas — início da loja">
            <img src="images/logo-dg-modas.png" alt="DG Modas — fabricação própria">
          </a>
          <div class="header-actions">
            <button class="icon-button cart-trigger" type="button" data-action="open-cart" aria-label="Abrir sacola, ${cartCount} itens" aria-expanded="${activeDrawer === "cart"}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
              <span class="cart-count" aria-hidden="true">${cartCount}</span>
            </button>
          </div>
        </div>
      </header>`;
  }

  function promotionPopup() {
    if (!promotionOpen) return "";
    return `
      <div class="promotion-backdrop" data-action="dismiss-promotion">
        <section class="promotion-dialog" role="dialog" aria-modal="true" aria-labelledby="promotion-title" aria-describedby="promotion-description">
          <button class="promotion-close" type="button" data-action="dismiss-promotion" aria-label="Fechar promoção">×</button>
          <span class="promotion-eyebrow">A oferta mais esperada do ano</span>
          <h2 id="promotion-title">BLACK FRIDAY <span>DG MODAS</span> 🖤💜</h2>
          <p class="promotion-main-offer">COMPRE R$ 500 E GANHE R$ 100 EM PRODUTOS GRÁTIS!</p>
          <p id="promotion-description" class="promotion-description">Todas as peças do nosso catálogo participam. Escolha suas favoritas e combine diferentes produtos grátis até R$ 100.</p>
          <p class="promotion-total">PAGUE R$ 500 E LEVE R$ 600 EM PRODUTOS!</p>
          <p class="promotion-terms">Benefício concedido em mercadorias, sem conversão em dinheiro ou desconto.</p>
          <button class="button promotion-cta" type="button" data-action="browse-promotion">APROVEITAR PROMOÇÃO</button>
        </section>
      </div>`;
  }

  function footer() {
    return `
      <footer class="site-footer">
        <div class="site-footer-inner">
          <span>SuaVitrine · catálogo independente</span>
          <span>Preços fixos no catálogo · atendimento pelo WhatsApp.</span>
        </div>
      </footer>`;
  }

  function contactButton() {
    const route = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const product = route[0] === "produto"
      ? products.find(function (item) { return item.id === route[1]; })
      : null;
    let message = "Olá! Gostaria de informações sobre as peças da loja.";
    if (product) {
      const variation = [selectedColor, selectedSize].filter(Boolean).join(" · ") || product.name;
      const localOnlySize = product.localSizes.includes(selectedSize) && !chosenVariant(product);
      message = "Olá! Tenho interesse em " + product.name + " — " + variation +
        (localOnlySize ? " (tamanho solicitado; confirmar disponibilidade)" : "") + ".";
    }
    return `<a class="contact-whatsapp" data-contact-whatsapp data-action="contact" data-message="${escapeHTML(message)}" href="${escapeHTML(whatsappHref(message))}" aria-label="Falar com a loja pelo WhatsApp" target="_blank" rel="noopener noreferrer" title="WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.6 12.6 0 0 0 5.2 22.3L3.5 28.7l6.6-1.7A12.7 12.7 0 1 0 16 3.2Zm0 22.9c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.9 1 1-3.8-.3-.4a10.4 10.4 0 1 1 8.9 4.9Zm5.7-7.8c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.1-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7.8.4 1.4.6 1.9.7.8.3 1.5.2 2 .1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>
    </a>`;
  }

  function drawer(activeCategory) {
    if (!activeDrawer) return "";
    const isMenu = activeDrawer === "menu";
    const cart = readCart();
    return `
      <div class="drawer-overlay ${drawerClosing ? "drawer-closing" : ""}" data-action="close-drawer">
        <aside class="drawer-panel ${isMenu ? "menu-drawer" : "cart-drawer"} ${drawerClosing ? "drawer-closing" : ""}" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <div class="drawer-header">
            <div><span class="eyebrow">${isMenu ? "Navegue pela loja" : "Confira sua seleção"}</span><h2 id="drawer-title">${isMenu ? "Categorias" : "Seu pedido"}</h2></div>
            <button class="icon-button drawer-close" type="button" data-action="close-drawer" aria-label="Fechar painel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
          </div>
          ${isMenu ? `
            <nav class="drawer-nav" aria-label="Navegação da loja">
              <a href="#/" ${!activeCategory ? 'aria-current="page"' : ""}>Início</a>
              ${categories.map(function (category) {
                return `<a href="${categoryHref(category)}" ${activeCategory === category.id ? 'aria-current="page"' : ""}>${escapeHTML(category.title)}</a>`;
              }).join("")}
            </nav>
          ` : cartContents(true, cart)}
        </aside>
      </div>`;
  }

  function priceDisplay(product, location) {
    const amount = parsePrice(priceFor(product));
    return `
      <div class="${location === "card" ? "card-price" : "price-field"}">
        <span class="price-caption">Preço</span>
        <output class="${location === "card" ? "price-display" : "detail-price"}" data-price-display="${escapeHTML(product.id)}">${amount === null ? "Preço não definido" : formatPrice(amount)}</output>
      </div>`;
  }

  function productCard(product) {
    const image = product.images[0];
    const category = categoryFor(product);
    const requiresVariants = product.category === "biquini-de-fita";
    return `
      <article class="product-card">
        <a class="product-image-link" href="${productHref(product)}" aria-label="Ver ${escapeHTML(product.name)}">
          <img class="product-image" src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy">
        </a>
        <h3><a href="${productHref(product)}">${escapeHTML(product.name)}</a></h3>
        <p class="product-category-label">${escapeHTML(category ? category.title : "Moda")}</p>
        ${priceDisplay(product, "card")}
        <div class="card-actions">
          <a class="button button-secondary button-small" href="${productHref(product)}">Ver detalhes</a>
          ${requiresVariants
            ? `<a class="button button-small" href="${productHref(product)}">Escolher variações</a>`
            : `<button class="button button-small" type="button" data-action="add" data-product="${escapeHTML(product.id)}">Adicionar ao pedido</button>`}
        </div>
      </article>`;
  }

  function productGrid(list) {
    if (list.length === 0) {
      return `<p class="empty-state">Os arquivos locais não incluem cartões de produtos nesta categoria. Nenhum item foi associado por suposição.</p>`;
    }
    return `<div class="product-grid">${list.map(productCard).join("")}</div>`;
  }

  function homePage() {
    const heroImage = products.find(function (product) { return product.images.length; }).images[0];
    const categoryCards = categories.map(function (category) {
      const matchingProducts = products.filter(function (product) {
        return category.family
          ? product.family === category.family
          : product.category === category.category;
      });
      const featuredProduct = matchingProducts.find(function (product) {
        return product.id === categoryImageProducts[category.id] && product.images.length;
      });
      const image = featuredProduct || matchingProducts.find(function (product) { return product.images.length; });
      const count = matchingProducts.length;
      return `<a class="category-tile ${image ? "" : "category-tile-empty"}" href="${categoryHref(category)}" aria-label="Ver categoria ${escapeHTML(category.title)}${count ? ", " + count + (count === 1 ? " produto" : " produtos") : ", sem produtos com foto disponíveis"}">
        ${image ? `<img src="${escapeHTML(image.images[0])}" alt="" loading="lazy">` : `<span class="category-no-photo" aria-hidden="true">SV</span>`}
        <span class="category-tile-shade"></span>
        <span class="category-tile-copy"><strong>${escapeHTML(category.title)}</strong><small>${count ? count + (count === 1 ? " produto" : " produtos") : "Sem fotos disponíveis"}</small></span>
      </a>`;
    }).join("");
    return `
      <main class="page home-page">
        <section class="hero" aria-label="Destaque da loja">
          <div>
            <span class="eyebrow">Catálogo digital</span>
            <h1>Uma vitrine feita para a sua loja.</h1>
            <p>Descubra peças femininas e moda praia, escolha suas variações e monte seu pedido em poucos passos.</p>
          </div>
          <div class="hero-visual"><img src="${escapeHTML(heroImage)}" alt="" fetchpriority="high"></div>
        </section>
        <section aria-labelledby="categories-heading">
          <div class="section-heading">
            <h2 id="categories-heading">Compre por categoria</h2>
            <p>Encontre sua próxima peça favorita</p>
          </div>
          <div class="category-grid">${categoryCards}</div>
        </section>
        <section id="catalog-products" aria-labelledby="products-heading">
          <div class="section-heading">
            <h2 id="products-heading">Peças disponíveis</h2>
            <p>${products.length} produtos identificados nos cartões locais</p>
          </div>
          ${productGrid(products)}
        </section>
      </main>`;
  }

  function categoryPage(categoryId) {
    const category = categories.find(function (item) { return item.id === categoryId; });
    if (!category) return notFoundPage();
    const list = products.filter(function (product) {
      return category.family
        ? product.family === category.family
        : product.category === category.category;
    });
    return `
      <main class="page">
        <div class="breadcrumbs"><a href="#/">Início</a><span aria-hidden="true">/</span><span>${escapeHTML(category.title)}</span></div>
        <span class="eyebrow">Categoria</span>
        <h1 class="page-title">${escapeHTML(category.title)}</h1>
        <p class="page-intro">${list.length ? list.length + (list.length === 1 ? " produto encontrado nos arquivos locais." : " produtos encontrados nos arquivos locais.") : "Esta categoria existe na navegação original, mas não há cartões de produto correspondentes nos arquivos locais."}</p>
        <section aria-label="Produtos de ${escapeHTML(category.title)}" style="margin-top:24px">${productGrid(list)}</section>
      </main>`;
  }

  function productPage(productId) {
    const product = products.find(function (item) { return item.id === productId; });
    if (!product) return notFoundPage();
    if (!product.colors.includes(selectedColor)) selectedColor = product.colors[0] || "";
    const sizesInSource = variantsForColor(product, selectedColor).map(function (variant) {
      return variant.size;
    }).filter(function (size, index, list) {
      return size && list.indexOf(size) === index;
    });
    const sizes = product.family === "moda-praia"
      ? BEACHWEAR_SIZES
      : sizesInSource;
    if (!sizes.includes(selectedSize) || !sizeIsSelectable(product, selectedColor, selectedSize)) {
      selectedSize = product.requiresSizeSelection ? "" : sizes.find(function (size) {
        return sizeIsSelectable(product, selectedColor, size);
      }) || "";
    }
    const gallery = galleryFor(product, selectedColor);
    selectedImage = Math.min(selectedImage, gallery.length - 1);
    const category = categoryFor(product);
    const mainImage = gallery[selectedImage] || gallery[0] || "";
    const swatch = swatchFor(product, selectedColor);
    const selectedSku = chosenVariant(product);
    const localOnlySize = product.localSizes.includes(selectedSize) && !selectedSku;
    const canAddSelectedVariant = !!selectedSku ||
      (localOnlySize && sizeIsSelectable(product, selectedColor, selectedSize));
    const colorSelector = product.colors.length
      ? `<div class="variant-field">
          <label for="product-color">Cor / estampa</label>
          <select class="variant-select" id="product-color" data-variant-color>
            ${product.colors.map(function (color) {
              return `<option value="${escapeHTML(color)}" ${color === selectedColor ? "selected" : ""}>${escapeHTML(color)}</option>`;
            }).join("")}
          </select>
          <span class="selected-color">${swatch ? `<img src="${escapeHTML(swatch)}" alt="" loading="lazy">` : ""}<span>${escapeHTML(selectedColor)}</span></span>
        </div>`
      : "";
    const sizeSelector = sizes.length
      ? `<div class="variant-field">
          <label for="product-size">Tamanho</label>
          <select class="variant-select" id="product-size" data-variant-size>
            ${product.requiresSizeSelection ? `<option value="" disabled ${!selectedSize ? "selected" : ""}>Selecione um tamanho</option>` : ""}
            ${sizes.map(function (size) {
              const selectable = sizeIsSelectable(product, selectedColor, size);
              const hasSourceVariant = variantsForColor(product, selectedColor).some(function (variant) {
                return variant.size === size;
              });
              const status = selectable
                ? ""
                : product.family === "moda-praia" && hasSourceVariant && size === "P"
                  ? " (indisponível na origem)"
                  : " (não cadastrado)";
              return `<option value="${escapeHTML(size)}" ${size === selectedSize ? "selected" : ""} ${selectable ? "" : "disabled"}>${escapeHTML(size + status)}</option>`;
            }).join("")}
          </select>
        </div>`
      : `<p class="product-description">Tamanhos não informados nos dados disponíveis.</p>`;
    return `
      <main class="page">
        <div class="breadcrumbs"><a href="#/">Início</a><span aria-hidden="true">/</span>${category ? `<a href="${categoryHref(category)}">${escapeHTML(category.title)}</a><span aria-hidden="true">/</span>` : ""}<span>${escapeHTML(product.name)}</span></div>
        <article class="product-detail">
          <section aria-label="Galeria de ${escapeHTML(product.name)}">
            ${mainImage
              ? `<img class="gallery-main" data-gallery-main src="${escapeHTML(mainImage)}" alt="${escapeHTML(product.name)} — foto ${selectedImage + 1}">
                <div class="gallery-thumbs" role="group" aria-label="Fotos de ${escapeHTML(product.name)}">
                  ${gallery.map(function (image, index) {
                    return `<button class="gallery-thumb" type="button" data-action="gallery" data-index="${index}" aria-label="Mostrar foto ${index + 1}" aria-pressed="${index === selectedImage}"><img src="${escapeHTML(image)}" alt="Foto ${index + 1} de ${escapeHTML(product.name)}" loading="lazy"></button>`;
                  }).join("")}
                </div>`
              : `<div class="gallery-unavailable" role="status">Imagem não disponível para a cor selecionada.</div>`}
          </section>
          <section class="product-detail-copy">
            <span class="eyebrow">${escapeHTML(category ? category.title : "Produto")}</span>
            <h1>${escapeHTML(product.name)}</h1>
            <p class="product-description">Confira as fotos disponíveis e adicione esta peça ao seu pedido.</p>
            <div class="variant-selectors">${colorSelector}${sizeSelector}</div>
            ${product.requiresSizeSelection ? `<p class="product-description">Disponibilidade dos tamanhos P, M e G a confirmar com a loja.</p>` : ""}
            ${priceDisplay(product, "detail")}
            <section class="info-note" aria-labelledby="exchange-policy-title">
              <h2 id="exchange-policy-title">POLÍTICA DE TROCAS E DEVOLUÇÕES</h2>
              <p>Na DG Modas, prezamos pela qualidade das nossas peças e pela satisfação de nossas clientes.</p>
              <p>Caso o produto apresente defeito de fabricação, a cliente poderá solicitar uma análise para troca em até <strong>30 dias corridos após o recebimento</strong>.</p>
              <p>Para solicitar atendimento, entre em contato pelo <a href="${escapeHTML(whatsappHref("Olá! Gostaria de solicitar atendimento sobre uma troca ou devolução."))}" target="_blank" rel="noopener noreferrer">WhatsApp da loja</a>, informando o número do pedido e enviando fotografias do defeito.</p>
              <p>As solicitações serão analisadas conforme o Código de Defesa do Consumidor, respeitando os direitos e prazos legais.</p>
            </section>
            <div class="product-detail-actions">
              <button class="button" type="button" data-action="add" data-product="${escapeHTML(product.id)}" data-selected-variant="${escapeHTML(selectedSku ? selectedSku.id : "")}" ${product.requiresSizeSelection && (!selectedSize || !sizeSelectionConfirmed) || product.variants.some(function (variant) { return variant.size; }) && !canAddSelectedVariant ? "disabled" : ""}>Adicionar ao pedido</button>
            </div>
          </section>
        </article>
      </main>`;
  }

  function cartPage() {
    const cart = readCart();
    return `
      <main class="page">
        <div class="breadcrumbs"><a href="#/">Início</a><span aria-hidden="true">/</span><span>Pedido</span></div>
        <span class="eyebrow">Sua seleção</span>
        <h1 class="page-title">Pedido</h1>
        ${cartContents(false, cart)}
      </main>`;
  }

  function cartContents(isDrawer, cart) {
    const lines = cart.map(function (item) {
      const product = products.find(function (entry) { return entry.id === item.id; });
      return { item: item, product: product, price: parsePrice(priceFor(product)) };
    });
    const totalCents = lines.reduce(function (sum, line) {
      return line.price === null ? sum : sum + Math.round(line.price * 100) * line.item.quantity;
    }, 0);
    const total = totalCents / 100;
    const hasMissingPrice = lines.some(function (line) { return line.price === null; });
    const blackFridayEligible = !hasMissingPrice && totalCents >= BLACK_FRIDAY_THRESHOLD_CENTS;
    const finalProductTotal = total;
    const pieceCount = lines.reduce(function (sum, line) { return sum + line.item.quantity; }, 0);
    const minimumOrderReached = !hasMissingPrice && totalCents >= MINIMUM_ORDER * 100;
    const shippingNote = totalCents >= FREE_SHIPPING_THRESHOLD * 100
      ? "A calcular (pedido na faixa de frete grátis; confirmar CEP e cobertura)"
      : "A calcular";
    const message = [
      "🛍️ *NOVO PEDIDO*",
      "",
      "Olá! Gostaria de finalizar meu pedido:",
      "",
      lines.map(function (line, index) {
        return [
          "*PRODUTO " + String(index + 1).padStart(2, "0") + "*",
          "Nome: " + line.product.name,
          line.product.category === "biquini-de-fita" ? "Coleção: Marquinha de Fita" : "",
          "Cor: " + (line.item.color || "Não informada"),
          "Tamanho: " + (line.item.size || "Não informado"),
          "Quantidade: " + line.item.quantity,
          "Valor unitário: " + (line.price === null ? "Não definido" : formatPrice(line.price)),
          "Subtotal: " + (line.price === null ? "Não definido" : formatPrice(Math.round(line.price * 100) * line.item.quantity / 100)),
          line.item.localSize ? "Observação: tamanho solicitado; confirmar disponibilidade." : ""
        ].filter(Boolean).join("\n");
      }).join("\n\n"),
      "",
      "━━━━━━━━━━━━",
      "*RESUMO DO PEDIDO*",
      "",
      "Total de peças: " + pieceCount,
      (hasMissingPrice ? "Subtotal dos itens com preço: " : "Subtotal: ") + formatPrice(total),
      "Black Friday: " + (blackFridayEligible
        ? "benefício liberado — escolha até " + formatPrice(BLACK_FRIDAY_GIFT_CENTS / 100) + " em produtos grátis junto à loja"
        : "a partir de " + formatPrice(BLACK_FRIDAY_THRESHOLD_CENTS / 100) + " em compras, ganhe " + formatPrice(BLACK_FRIDAY_GIFT_CENTS / 100) + " em produtos grátis"),
      "Frete: " + shippingNote,
      "*TOTAL FINAL DOS PRODUTOS: " + formatPrice(finalProductTotal) + (hasMissingPrice ? " (parcial; há itens sem preço)" : "") + "*",
      "Total final incluindo frete: " + formatPrice(finalProductTotal) + " + frete a calcular",
      "",
      "Gostaria de confirmar a disponibilidade e finalizar minha compra."
    ].join("\n");
    const checkoutDisabled = hasMissingPrice || !minimumOrderReached;
    const checkoutMessage = hasMissingPrice
      ? "A finalização está bloqueada porque há produtos sem preço cadastrado."
      : "O pedido mínimo é " + formatPrice(MINIMUM_ORDER) + ". Adicione mais " + formatPrice(Math.max(0, MINIMUM_ORDER * 100 - totalCents) / 100) + " para finalizar.";
    return lines.length ? `
      <div class="cart-content ${isDrawer ? "cart-content-drawer" : ""}">
        <div class="cart-list">
          ${lines.map(function (line) {
            return `<article class="cart-row" data-cart-product="${escapeHTML(line.product.id)}">
              ${line.item.color && !galleryFor(line.product, line.item.color).length
                ? `<span class="cart-row-image gallery-unavailable" role="img" aria-label="Imagem não disponível para a cor selecionada"></span>`
                : `<a class="cart-row-image" href="${productHref(line.product)}"><img src="${escapeHTML(line.item.color ? galleryFor(line.product, line.item.color)[0] : line.product.images[0])}" alt="${escapeHTML(line.product.name)}" loading="lazy"></a>`}
              <div class="cart-row-info"><h3><a href="${productHref(line.product)}">${escapeHTML(line.product.name)}</a></h3>
                <p>${line.product.category === "biquini-de-fita" ? "Coleção Marquinha de Fita · " : ""}${[line.item.color, line.item.size].filter(Boolean).map(escapeHTML).join(" / ") || "Variação não selecionada"}${line.item.localSize ? " · confirmar disponibilidade" : ""}</p>
                <span class="cart-unit-price">${line.price === null ? "Preço não definido" : formatPrice(line.price) + " cada"}</span>
                <strong class="cart-line-total">${line.price === null ? "" : formatPrice(Math.round(line.price * 100) * line.item.quantity / 100)}</strong>
              </div>
              <div class="cart-controls">
                <button type="button" data-action="decrease" data-product="${escapeHTML(line.product.id)}" data-cart-key="${escapeHTML(cartVariantKey(line.item))}" aria-label="Diminuir quantidade de ${escapeHTML(line.product.name)}">−</button>
                <span>${line.item.quantity}</span>
                <button type="button" data-action="increase" data-product="${escapeHTML(line.product.id)}" data-cart-key="${escapeHTML(cartVariantKey(line.item))}" aria-label="Aumentar quantidade de ${escapeHTML(line.product.name)}">+</button>
                <button class="cart-remove" type="button" data-action="remove" data-product="${escapeHTML(line.product.id)}" data-cart-key="${escapeHTML(cartVariantKey(line.item))}" aria-label="Remover ${escapeHTML(line.product.name)}">×</button>
              </div>
            </article>`;
          }).join("")}
        </div>
        <div class="cart-summary">
          <div class="cart-totals">
            <div class="cart-total-row"><span>${hasMissingPrice ? "Subtotal parcial" : "Subtotal"}</span><strong>${formatPrice(total)}${hasMissingPrice ? " + itens sem preço" : ""}</strong></div>
            <p class="black-friday-cart-note" role="status">${blackFridayEligible
              ? "🎁 Benefício Black Friday liberado: escolha até R$ 100 em produtos grátis e informe suas opções à loja ao enviar o pedido."
              : "Na Black Friday, compras a partir de R$ 500 dão direito a R$ 100 em produtos grátis. O benefício é em mercadorias, não em desconto."}</p>
            <div class="cart-total-row cart-total-final"><span>Total final dos produtos</span><strong>${formatPrice(finalProductTotal)}${hasMissingPrice ? " + itens sem preço" : ""}</strong></div>
          </div>
          <p class="shipping-note">${hasMissingPrice ? "Frete: A calcular" : "Frete: " + shippingNote}</p>
          ${checkoutDisabled
            ? `<button class="button whatsapp-button checkout-disabled" type="button" disabled>${isDrawer ? "Finalizar pedido" : "Enviar pedido pelo WhatsApp"}</button><p class="checkout-notice" role="status">${escapeHTML(checkoutMessage)}</p>`
            : `<a class="button whatsapp-button" data-whatsapp-link href="${escapeHTML(whatsappHref(message))}" target="_blank" rel="noopener noreferrer" data-message="${escapeHTML(message)}">${isDrawer ? "Finalizar pedido" : "Enviar pedido pelo WhatsApp"}</a>`}
        </div>
      </div>` : `<div class="drawer-empty"><p class="empty-state">Sua sacola ainda está vazia. Explore o catálogo e adicione suas peças favoritas.</p><a class="button button-secondary" href="#/">Ver produtos</a></div>`;
  }

  function notFoundPage() {
    return `<main class="page"><span class="eyebrow">Página não encontrada</span><h1 class="page-title">Não encontramos este conteúdo.</h1><p class="page-intro">Escolha uma categoria para continuar navegando pelo catálogo local.</p><a class="button" href="#/">Voltar ao início</a></main>`;
  }

  function showToast(message) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.appendChild(toast);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.remove(); }, 4200);
  }

  function closeDrawer() {
    if (!activeDrawer || drawerClosing) return;
    const triggerSelector = activeDrawer === "cart" ? ".cart-trigger" : ".menu-trigger";
    drawerClosing = true;
    render();
    window.clearTimeout(drawerCloseTimer);
    drawerCloseTimer = window.setTimeout(function () {
      activeDrawer = "";
      drawerClosing = false;
      render();
      const trigger = app.querySelector(triggerSelector);
      if (trigger) trigger.focus();
    }, 210);
  }

  function closePromotion(browseCatalog) {
    promotionOpen = false;
    if (browseCatalog && location.hash !== "#/") {
      scrollToPromotionCatalog = true;
      location.hash = "#/";
      return;
    }
    render();
    if (browseCatalog) {
      scrollToCatalog();
    } else {
      const brand = app.querySelector(".brand");
      if (brand) brand.focus();
    }
  }

  function scrollToCatalog() {
    const catalog = app.querySelector("#catalog-products");
    if (catalog) {
      catalog.scrollIntoView({
        behavior: reducedMotionPreference.matches ? "auto" : "smooth",
        block: "start"
      });
    }
  }

  function render() {
    const route = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const cartCount = readCart().reduce(function (sum, item) { return sum + item.quantity; }, 0);
    let activeCategory = "";
    let content;
    if (route[0] === "categoria") {
      activeCategory = route[1] || "";
      content = categoryPage(activeCategory);
    } else if (route[0] === "produto") {
      content = productPage(route[1] || "");
    } else if (route[0] === "pedido") {
      content = activeDrawer === "cart" ? homePage() : cartPage();
    } else if (route.length === 0) {
      content = homePage();
    } else {
      content = notFoundPage();
    }
    document.title = route[0] === "produto"
      ? ((products.find(function (product) { return product.id === route[1]; }) || {}).name || "Produto") + " | SuaVitrine"
      : "SuaVitrine | Catálogo digital";
    app.innerHTML = header(cartCount, activeCategory) + content + footer() + contactButton() + drawer(activeCategory) + promotionPopup();
    document.body.classList.toggle("drawer-open", !!activeDrawer || promotionOpen);
    if (activeDrawer) {
      window.requestAnimationFrame(function () {
        const closeButton = app.querySelector(".drawer-close");
        if (closeButton) closeButton.focus();
      });
    } else if (promotionOpen) {
      window.requestAnimationFrame(function () {
        const closeButton = app.querySelector(".promotion-close");
        if (closeButton) closeButton.focus();
      });
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  app.addEventListener("change", function (event) {
    if (event.target.matches("[data-variant-color]")) {
      selectedColor = event.target.value;
      const route = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
      const product = route[0] === "produto"
        ? products.find(function (item) { return item.id === route[1]; })
        : null;
      if (!product || !sizeIsSelectable(product, selectedColor, selectedSize)) {
        selectedSize = "";
        sizeSelectionConfirmed = false;
      }
      selectedImage = 0;
      render();
    } else if (event.target.matches("[data-variant-size]")) {
      selectedSize = event.target.value;
      sizeSelectionConfirmed = true;
      render();
    }
  });

  app.addEventListener("error", function (event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.matches("[data-gallery-main]") || !app.contains(image)) return;
    const unavailable = document.createElement("div");
    unavailable.className = "gallery-unavailable";
    unavailable.setAttribute("role", "status");
    unavailable.textContent = "Não foi possível carregar a imagem desta cor.";
    image.replaceWith(unavailable);
    const thumbnails = app.querySelector(".gallery-thumbs");
    if (thumbnails) thumbnails.remove();
  }, true);

  app.addEventListener("click", function (event) {
    const target = event.target.closest("[data-action]");
    if (target) {
      const action = target.dataset.action;
      const productId = target.dataset.product;
      if (action === "dismiss-promotion") {
        if (target === event.target || target.matches(".promotion-close")) {
          closePromotion(false);
          return;
        }
      } else if (action === "browse-promotion") {
        closePromotion(true);
        return;
      } else if (action === "open-menu" || action === "open-cart") {
        activeDrawer = action === "open-menu" ? "menu" : "cart";
        render();
        return;
      } else if (action === "close-drawer") {
        if (target === event.target || target.classList.contains("drawer-close")) {
          closeDrawer();
          return;
        }
      } else if (action === "contact") {
        return;
      } else if (action === "gallery") {
        const route = location.hash.replace(/^#\/?/, "").split("/");
        const product = products.find(function (item) { return item.id === route[1]; });
        const gallery = product ? galleryFor(product, selectedColor) : [];
        const requestedImage = Number(target.dataset.index);
        if (product && gallery[requestedImage]) {
          selectedImage = requestedImage;
          const main = app.querySelector("[data-gallery-main]");
          if (main) {
            main.src = gallery[selectedImage];
            main.alt = product.name + " — foto " + (selectedImage + 1);
            app.querySelectorAll(".gallery-thumb").forEach(function (button, index) {
              button.setAttribute("aria-pressed", String(index === selectedImage));
            });
          }
        }
      } else if (action === "add") {
        const cart = readCart();
        const route = location.hash.replace(/^#\/?/, "").split("/");
        const detailProduct = route[0] === "produto"
          ? products.find(function (item) { return item.id === productId; })
          : null;
        const variant = detailProduct ? chosenVariant(detailProduct) : null;
        if (detailProduct && detailProduct.requiresSizeSelection && (!selectedSize || !sizeSelectionConfirmed)) {
          showToast("Selecione um tamanho antes de adicionar ao pedido.");
          return;
        }
        const localOnlySize = !!detailProduct && detailProduct.localSizes.includes(selectedSize) &&
          sizeIsSelectable(detailProduct, selectedColor, selectedSize) && !variant;
        if (detailProduct && detailProduct.variants.some(function (entry) { return entry.size; }) && !variant && !localOnlySize) {
          showToast("Selecione uma combinação de cor e tamanho disponível para adicionar ao pedido.");
          return;
        }
        const variantId = variant ? variant.id : "";
        const newItem = {
          id: productId,
          quantity: 1,
          variantId: variantId,
          color: variant ? variant.color : (detailProduct ? selectedColor : ""),
          size: variant ? variant.size : (detailProduct ? selectedSize : ""),
          localSize: localOnlySize,
          image: detailProduct ? galleryFor(detailProduct, selectedColor)[0] : ""
        };
        const existing = cart.find(function (item) {
          return item.id === productId && cartVariantKey(item) === cartVariantKey(newItem);
        });
        if (existing) existing.quantity += 1;
        else cart.push(newItem);
        saveCart(cart);
        render();
        showToast("Produto adicionado ao pedido.");
      } else if (["increase", "decrease", "remove"].includes(action)) {
        let cart = readCart();
        const key = target.dataset.cartKey || "";
        const item = cart.find(function (entry) {
          return entry.id === productId && cartVariantKey(entry) === key;
        });
        if (action === "remove") {
          cart = cart.filter(function (entry) {
            return entry.id !== productId || cartVariantKey(entry) !== key;
          });
        } else if (item) {
          item.quantity += action === "increase" ? 1 : -1;
          cart = cart.filter(function (entry) { return entry.quantity > 0; });
        }
        saveCart(cart);
        render();
      }
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && promotionOpen) {
      closePromotion(false);
    } else if (event.key === "Tab" && promotionOpen) {
      const focusable = app.querySelectorAll(".promotion-dialog button:not(:disabled)");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    } else if (event.key === "Escape" && activeDrawer) {
      closeDrawer();
    }
  });

  window.addEventListener("hashchange", function () {
    selectedImage = 0;
    selectedColor = "";
    selectedSize = "";
    sizeSelectionConfirmed = false;
    window.clearTimeout(drawerCloseTimer);
    activeDrawer = "";
    drawerClosing = false;
    render();
    if (scrollToPromotionCatalog) {
      scrollToPromotionCatalog = false;
      scrollToCatalog();
    }
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) return;
    const route = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const product = route[0] === "produto"
      ? products.find(function (item) { return item.id === route[1]; })
      : null;
    if (product && product.requiresSizeSelection) {
      selectedSize = "";
      sizeSelectionConfirmed = false;
      render();
    }
  });

  syncPromoCarousel();
  if (typeof reducedMotionPreference.addEventListener === "function") {
    reducedMotionPreference.addEventListener("change", syncPromoCarousel);
  } else if (typeof reducedMotionPreference.addListener === "function") {
    reducedMotionPreference.addListener(syncPromoCarousel);
  }

  render();
}());
