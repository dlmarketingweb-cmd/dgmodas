/* Carrinho lateral - Super Vaidosa Atacado (Bagy 3.0 / Tray)
 * 1. Quantidade com - e + em cada item, e o total da linha ("5 x R$ 60,00").
 *    A API publica da Tray so soma quantidade (POST) e apaga item (DELETE):
 *    "+" adiciona 1; "-" apaga a linha e recoloca com 1 a menos.
 * 2. "Continuar comprando" no rodape (em destaque enquanto o pedido minimo nao bate).
 * 3. Produto recomendado: menu com uma opcao so ("Tam Unico") ja vem escolhido;
 *    se houver cor, o tema abre o menu de cor para a cliente escolher.
 */
(function () {
  'use strict';

  var lateral = document.querySelector('.cart-sidebar');
  if (!lateral || window.__svCarrinho) return;
  window.__svCarrinho = true;

  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var ocupado = false;

  function sessao() {
    if (window.cart && typeof window.cart.session === 'function' && window.cart.session()) return window.cart.session();
    return document.documentElement.getAttribute('data-session');
  }

  function recarregarLista() {
    if (window.cart && typeof window.cart.listProduct === 'function') return window.cart.listProduct();
    return Promise.resolve();
  }

  function adicionar(produto, variacao, qtd) {
    return fetch('/web_api/cart/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ Cart: { session_id: sessao(), product_id: produto, variant_id: variacao, quantity: qtd } })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    });
  }

  function apagar(produto, variacao) {
    var caminho = '/web_api/carts/' + encodeURIComponent(sessao()) + '/' + produto + (variacao ? '/' + variacao : '');
    return fetch(caminho, { method: 'DELETE', credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    });
  }

  // ---------- GA4: add_to_cart ----------
  // Na Tray o add_to_cart so sai pelo botao nativo dela. Os botoes deste tema (vitrine, produto,
  // Lancamentos e o "+" da sacola) adicionam por POST /web_api/cart e o GA4 ficou sem o evento
  // desde a migracao (09/10/2026; de ~650/dia para 0). Um evento por adicao bem-sucedida, no
  // formato do view_item da Tray (item_id = produto-variacao). A Meta nao entra aqui: o AddToCart
  // dela ja tem dono (servidor da Tray, na pagina do carrinho).
  function avisarGa4(produto, variacao, qtd) {
    if (typeof window.gtag !== 'function' || !produto) return;
    qtd = parseInt(qtd, 10) || 1;
    var pegar = function (u) {
      return fetch(u, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .catch(function () { return {}; });
    };
    Promise.all([
      pegar('/web_api/products/' + produto),
      variacao ? pegar('/web_api/variants/' + variacao) : Promise.resolve({})
    ]).then(function (res) {
      var p = res[0].Product || {}, v = res[1].Variant || {};
      var cheio = parseFloat(v.price || p.price || 0) || 0;
      var promo = parseFloat(v.promotional_price || p.promotional_price || 0) || 0;
      var preco = promo > 0 && promo < cheio ? promo : cheio;
      var item = { item_id: produto + (variacao ? '-' + variacao : ''), item_name: p.name || '',
        item_brand: p.brand || 'Super Vaidosa', price: preco, quantity: qtd };
      if (p.category_name) item.item_category2 = p.category_name;
      window.gtag('event', 'add_to_cart', {
        currency: 'BRL', value: Math.round(preco * qtd * 100) / 100, items: [item]
      });
    }).catch(function () { /* medicao nunca quebra a compra */ });
  }

  function mostrarErro(item, texto) {
    var caixa = item.querySelector('.errorStock');
    if (!caixa) return;
    caixa.textContent = texto;
    setTimeout(function () { caixa.textContent = ''; }, 4000);
  }

  // ---------- 1. quantidade e total por linha ----------
  function prepararLinha(item) {
    if (item.getAttribute('data-sv-linha')) return;
    var remover = item.querySelector('.remove[data-id]');
    var qnt = item.querySelector('.qnt');
    var preco = item.querySelector('.price[data-price]');
    if (!remover || !qnt) return;
    // Kits e itens com informacao adicional ficam como a Tray mostra.
    if ((remover.getAttribute('data-together') || '0') !== '0' || remover.getAttribute('data-add')) return;

    var q = parseInt(String(qnt.textContent).replace(/\D/g, ''), 10) || 1;
    var unit = parseFloat(preco ? preco.getAttribute('data-price') : 'NaN');
    item.setAttribute('data-sv-linha', '1');

    qnt.innerHTML =
      '<div class="sv-linha-qtd" role="group" aria-label="Quantidade">' +
        '<button type="button" data-sv-acao="menos" aria-label="Diminuir quantidade"' + (q <= 1 ? ' disabled' : '') + '>&minus;</button>' +
        '<span class="sv-linha-num" aria-live="polite">' + q + '</span>' +
        '<button type="button" data-sv-acao="mais" aria-label="Aumentar quantidade">+</button>' +
      '</div>';

    if (preco && unit > 0) {
      preco.innerHTML =
        '<span class="sv-linha-total">' + brl.format(unit * q) + '</span>' +
        (q > 1 ? '<span class="sv-linha-unit">' + q + ' &times; ' + brl.format(unit) + '</span>' : '');
    }

    qnt.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-sv-acao]');
      if (!b || b.disabled || ocupado) return;
      var produto = parseInt(remover.getAttribute('data-id'), 10);
      var variacao = parseInt(remover.getAttribute('data-variant') || '0', 10) || null;
      ocupado = true;
      item.classList.add('sv-atualizando');

      var acao = b.getAttribute('data-sv-acao') === 'mais'
        ? adicionar(produto, variacao, 1).then(function () {
            avisarGa4(produto, variacao, 1);
          }, function () {
            mostrarErro(item, 'N\u00e3o h\u00e1 estoque para aumentar esta pe\u00e7a.');
          })
        : apagar(produto, variacao).then(function () {
            return adicionar(produto, variacao, q - 1).catch(function () {
              // Nao conseguiu recolocar com 1 a menos: devolve a quantidade original.
              return adicionar(produto, variacao, q).then(function () {
                mostrarErro(item, 'N\u00e3o foi poss\u00edvel alterar agora. Tente de novo.');
              });
            });
          });

      acao.catch(function () {
        mostrarErro(item, 'N\u00e3o foi poss\u00edvel alterar agora. Tente de novo.');
      }).then(function () {
        ocupado = false;
        return recarregarLista();
      });
    });
  }

  // ---------- 2. continuar comprando ----------
  function prepararRodape() {
    var rodape = lateral.querySelector('.footer-cart');
    if (!rodape || rodape.querySelector('.sv-continuar')) return;
    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'sv-continuar';
    botao.textContent = 'Continuar comprando';
    botao.addEventListener('click', function () {
      var fechar = lateral.querySelector('.close-cart');
      if (fechar) fechar.click();
      else {
        lateral.classList.remove('active');
        var sombra = document.querySelector('.overlay-shadow');
        if (sombra) sombra.classList.remove('show');
      }
    });
    rodape.appendChild(botao);
  }

  // ---------- 3. recomendado com opcao unica ----------
  function prepararRecomendados() {
    lateral.querySelectorAll('.related-product select').forEach(function (sel) {
      if (sel.value) return;
      var opcoes = Array.prototype.filter.call(sel.options, function (o) { return o.value; });
      if (opcoes.length !== 1) return;
      sel.value = opcoes[0].value;
      // O tema monta o proximo menu (ex.: Cor) a partir desta escolha; a cliente escolhe a cor.
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  // ---------- compra feita por fora do botao da Tray ----------
  // Ex.: compra rapida nos cards da vitrine (POST /web_api/cart). A Tray aceita, mas o carrinho
  // lateral, o contador e a trava do minimo so viam a peca depois de recarregar a pagina: a cliente
  // achava que nao tinha entrado e tocava de novo. Aqui, todo POST bem-sucedido no carrinho que nao
  // venha deste arquivo atualiza a lista e abre o carrinho lateral.
  function aposCompraExterna() {
    Promise.resolve(recarregarLista()).then(function () {
      if (window.cart && typeof window.cart.showCart === 'function') window.cart.showCart();
      lateral.classList.add('active');
      var sombra = document.querySelector('.overlay-shadow');
      if (sombra) sombra.classList.add('show');
    });
  }
  if (typeof window.fetch === 'function' && !window.__svFetchCarrinho) {
    window.__svFetchCarrinho = true;
    var fetchOriginal = window.fetch;
    // Sessao da cliente lida na hora (a Tray preenche <html data-session> depois que alguns
    // scripts ja leram; sem ela o POST volta 400 "session_id nao pode ser deixado em branco").
    var sessaoAgora = function () {
      var s = sessao();
      if (s) return Promise.resolve(s);
      // espera a Tray preencher data-session; o app.php devolve outra sessao (so em ultimo caso)
      return new Promise(function (ok) {
        var n = 0;
        var t = setInterval(function () {
          var v = sessao();
          if (v || ++n >= 25) { clearInterval(t); ok(v || ''); }
        }, 200);
      }).then(function (v) { return v || sessaoTray(); });
    };
    var sessaoTray = function () {
      var loja = document.documentElement.getAttribute('data-store') || '';
      return fetchOriginal.call(window, '/nocache/app.php?loja=' + encodeURIComponent(loja), { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return (j && j.hash) || ''; })
        .catch(function () { return ''; });
    };
    window.fetch = function (entrada, opcoes) {
      var self = this, args = arguments;
      var url = '', metodo = 'GET';
      try {
        url = String(entrada && entrada.url ? entrada.url : entrada);
        metodo = String((opcoes && opcoes.method) || (entrada && entrada.method) || 'GET').toUpperCase();
      } catch (e) { /* segue */ }
      var ehCompra = metodo === 'POST' && /\/web_api\/cart\/?(\?|$)/.test(url);
      if (!ehCompra) return fetchOriginal.apply(self, args);

      var corpo = null;
      try { corpo = opcoes && typeof opcoes.body === 'string' ? JSON.parse(opcoes.body) : null; } catch (e) { corpo = null; }
      var semSessao = !!(corpo && corpo.Cart && !corpo.Cart.session_id);
      var envio = !semSessao ? fetchOriginal.apply(self, args) : sessaoAgora().then(function (s) {
        if (!s) return fetchOriginal.apply(self, args);
        corpo.Cart.session_id = s;
        var novas = {};
        for (var k in opcoes) if (Object.prototype.hasOwnProperty.call(opcoes, k)) novas[k] = opcoes[k];
        novas.body = JSON.stringify(corpo);
        return fetchOriginal.call(self, entrada, novas);
      });
      if (!ocupado) {
        envio.then(function (r) {
          if (!r || !r.ok) return;
          setTimeout(aposCompraExterna, 150);
          // ocupado = "+"/"-" da sacola: o "+" avisa sozinho e o "-" (apaga e recoloca) nao e adicao.
          var c = corpo && corpo.Cart;
          if (c) avisarGa4(c.product_id, c.variant_id, c.quantity);
        }, function () {});
      }
      return envio;
    };
  }

  // ---------- observar o que o tema redesenha ----------
  var timer = null;
  function aplicar() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      lateral.querySelectorAll('.content-cart .list .item').forEach(prepararLinha);
      prepararRodape();
      prepararRecomendados();
    }, 80);
  }

  new MutationObserver(aplicar).observe(lateral, { childList: true, subtree: true });
  aplicar();
})();
