/* Pedido minimo - Super Vaidosa Atacado (Bagy 3.0 / Tray)
 * Le o carrinho pela API publica da loja, mostra quanto falta para o minimo e
 * so libera o checkout quando o carrinho chega nele.
 * Valor e liga/desliga: atributos data-valor e data-ativo do bloco .sv-minimo
 * em elements/snippets/sidecart.html (o editor do tema nao aceita campo novo). */
(function () {
  'use strict';

  var cfg = document.querySelector('.sv-minimo');
  if (!cfg || window.__svPedidoMinimo) return;
  window.__svPedidoMinimo = true;

  // No editor do tema o "Fechar pedido" abre o modal do editor: nao interfere.
  if (/[?&]editor=1(&|$)/.test(location.search)) return;

  var MINIMO = lerValor(cfg.getAttribute('data-valor'));
  if (cfg.getAttribute('data-ativo') === 'false' || !(MINIMO > 0)) return;

  var LINK_CHECKOUT = cfg.getAttribute('data-checkout') || '';
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var estado = { total: 0, pecas: 0, lido: false };
  var leituraEmCurso = null;
  var timerLeitura = null;

  var statusCarrinho = cfg.querySelector('.sv-minimo-status');
  var enchidoCarrinho = cfg.querySelector('.sv-minimo-enchido');
  var trilhoCarrinho = cfg.querySelector('.sv-minimo-trilho');
  var carrinhoLateral = document.querySelector('.cart-sidebar');

  // "147", "147,50", "1.470,00" ou "147.50"
  function lerValor(v) {
    v = String(v == null ? '' : v).replace(/[^\d,.]/g, '');
    if (v.indexOf(',') > -1) v = v.replace(/\./g, '').replace(',', '.');
    return parseFloat(v);
  }

  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

  // ---------- leitura do carrinho ----------
  // A sessao e lida da pagina A CADA leitura. Na 1a visita a pagina chega sem <html data-session>
  // (a Tray preenche depois) e o /nocache/app.php devolve OUTRA sessao, de carrinho vazio: guardar
  // aquele valor fazia a trava ver R$ 0 com pecas no carrinho e barrar o "Fechar pedido" (10/10/2026).
  function sessaoDaPagina() { return document.documentElement.getAttribute('data-session') || ''; }
  function obterSessao() {
    var s = sessaoDaPagina();
    if (s) return Promise.resolve(s);
    return new Promise(function (ok) {
      var n = 0;
      var t = setInterval(function () {
        var v = sessaoDaPagina();
        if (v || ++n >= 25) { clearInterval(t); ok(v); }
      }, 200);
    }).then(function (v) {
      if (v) return v;
      var loja = document.documentElement.getAttribute('data-store');
      return fetch('/nocache/app.php?loja=' + encodeURIComponent(loja), { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return (j && j.hash) || null; });
    });
  }

  // Plano B: o subtotal que o proprio carrinho lateral mostra.
  function totalDoCarrinhoLateral() {
    var el = document.querySelector('.cart-sidebar .total .value');
    var n = el ? lerValor(el.textContent) : NaN;
    var vazio = document.querySelector('.cart-sidebar .content-cart.empty');
    if (isNaN(n)) return null;
    return { total: n, pecas: vazio ? 0 : 1, lido: true };
  }

  function lerCarrinho() {
    if (leituraEmCurso) return leituraEmCurso;
    leituraEmCurso = obterSessao()
      .then(function (s) {
        if (!s) throw new Error('sem sessao');
        return fetch('/web_api/cart/' + encodeURIComponent(s), {
          credentials: 'same-origin',
          headers: { 'Accept': 'application/json' }
        });
      })
      .then(function (r) {
        if (r.status === 404) return [];
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (lista) {
        var total = 0, pecas = 0;
        (Array.isArray(lista) ? lista : []).forEach(function (item) {
          var c = item.Cart || item;
          var q = parseInt(c.quantity, 10) || 0;
          total += (parseFloat(c.price) || 0) * q;
          pecas += q;
        });
        estado = { total: Math.round(total * 100) / 100, pecas: pecas, lido: true };
      })
      .catch(function () {
        estado = totalDoCarrinhoLateral() || { total: 0, pecas: 0, lido: false };
      })
      .then(function () {
        leituraEmCurso = null;
        pintar();
        return estado;
      });
    return leituraEmCurso;
  }

  function agendarLeitura() {
    clearTimeout(timerLeitura);
    timerLeitura = setTimeout(lerCarrinho, 300);
  }

  function liberado() {
    return estado.lido && estado.pecas > 0 && estado.total >= MINIMO;
  }

  function falta() {
    return Math.max(0, Math.round((MINIMO - estado.total) * 100) / 100);
  }

  // ---------- interface ----------
  var barra = document.createElement('div');
  barra.className = 'sv-barra';
  barra.setAttribute('role', 'region');
  barra.setAttribute('aria-label', 'Pedido m\u00ednimo');
  barra.innerHTML =
    '<div class="sv-barra-in">' +
      '<div class="sv-barra-info">' +
        '<p class="sv-barra-texto" aria-live="polite"></p>' +
        '<div class="sv-minimo-trilho" aria-hidden="true"><div class="sv-minimo-enchido"></div></div>' +
      '</div>' +
      '<a class="sv-barra-botao" href="#" rel="nofollow">Ver carrinho</a>' +
    '</div>';
  document.body.appendChild(barra);

  var aviso = document.createElement('div');
  aviso.className = 'sv-aviso';
  aviso.setAttribute('role', 'status');
  aviso.setAttribute('aria-live', 'polite');
  document.body.appendChild(aviso);

  var timerAviso = null;
  function avisar(texto) {
    aviso.textContent = texto;
    aviso.classList.add('sv-visivel');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () { aviso.classList.remove('sv-visivel'); }, 3500);
  }

  function tremer(el) {
    if (!el) return;
    el.classList.remove('sv-tremer');
    void el.offsetWidth;
    el.classList.add('sv-tremer');
  }

  function abrirCarrinho() {
    if (window.cart && typeof window.cart.showCart === 'function') window.cart.showCart();
    if (carrinhoLateral) carrinhoLateral.classList.add('active');
    var sombra = document.querySelector('.overlay-shadow');
    if (sombra) sombra.classList.add('show');
  }

  function carrinhoAberto() {
    return !!(carrinhoLateral && carrinhoLateral.classList.contains('active'));
  }

  function textoFalta() {
    return 'Faltam <strong>' + brl.format(falta()) + '</strong> para o pedido m\u00ednimo de ' + brl.format(MINIMO);
  }

  function pintar() {
    var ok = liberado();
    var pct = Math.min(100, Math.round(estado.total / MINIMO * 100));

    // Bloco dentro do carrinho lateral
    cfg.hidden = !(estado.lido && estado.pecas > 0);
    cfg.classList.toggle('sv-ok', ok);
    if (statusCarrinho) {
      statusCarrinho.innerHTML = ok ? 'Pedido m\u00ednimo atingido \u2713' : textoFalta();
    }
    if (enchidoCarrinho) enchidoCarrinho.style.width = pct + '%';
    if (trilhoCarrinho) trilhoCarrinho.setAttribute('aria-valuenow', String(pct));

    // Botao "Fechar pedido" do carrinho lateral
    document.querySelectorAll('.footer-cart a.buy').forEach(function (b) {
      if (!b.hasAttribute('data-texto-original')) b.setAttribute('data-texto-original', b.textContent.trim());
      var bloqueado = estado.lido && !ok;
      b.classList.toggle('sv-bloqueado', bloqueado);
      b.setAttribute('aria-disabled', bloqueado ? 'true' : 'false');
      b.textContent = bloqueado
        ? 'Faltam ' + brl.format(falta()) + ' para fechar'
        : b.getAttribute('data-texto-original');
    });

    // Barra fixa
    var texto = barra.querySelector('.sv-barra-texto');
    var botao = barra.querySelector('.sv-barra-botao');
    barra.classList.toggle('sv-ok', ok);
    barra.querySelector('.sv-minimo-enchido').style.width = pct + '%';
    if (ok) {
      texto.innerHTML = 'M\u00ednimo atingido \u00b7 <strong>' + brl.format(estado.total) + '</strong>';
      botao.textContent = 'Fechar pedido';
      botao.setAttribute('href', LINK_CHECKOUT || '#');
    } else {
      texto.innerHTML = 'Faltam <strong>' + brl.format(falta()) + '</strong> para o m\u00ednimo';
      botao.textContent = 'Ver carrinho';
      botao.setAttribute('href', '#');
    }
    atualizarVisibilidadeBarra();

    // Nota na pagina de produto
    var nota = document.querySelector('.sv-minimo-nota');
    if (!nota) {
      var acoes = document.querySelector('.product-wrapper .product-form .actions');
      if (acoes) {
        nota = document.createElement('p');
        nota.className = 'sv-minimo-nota';
        acoes.parentNode.insertBefore(nota, acoes.nextSibling);
      }
    }
    if (nota) {
      var base = 'Pedido m\u00ednimo de <strong>' + brl.format(MINIMO) + '</strong>, combinando pe\u00e7as e cores como quiser.';
      if (estado.lido && estado.pecas > 0) {
        base += ok
          ? ' Seu carrinho j\u00e1 atingiu o m\u00ednimo.'
          : ' Seu carrinho: <strong>' + brl.format(estado.total) + '</strong> (faltam ' + brl.format(falta()) + ').';
      }
      nota.innerHTML = base;
    }
  }

  function atualizarVisibilidadeBarra() {
    var mostrar = estado.lido && estado.pecas > 0 && !carrinhoAberto();
    barra.classList.toggle('sv-visivel', mostrar);
    document.body.classList.toggle('sv-com-barra', mostrar);
  }

  // ---------- trava do checkout ----------
  function levaAoCheckout(a) {
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^javascript:/i.test(href)) return false;
    if (LINK_CHECKOUT && (href === LINK_CHECKOUT || a.href === LINK_CHECKOUT)) return true;
    return /redirect_cart_service|\/checkout(\/|\?|#|$)|carrinho\.php/i.test(href);
  }

  function barrar(destino) {
    if (!estado.lido) {
      // Nao foi possivel ler o carrinho: nao prende a cliente no site.
      if (destino) location.href = destino;
      return;
    }
    if (liberado()) {
      if (destino) location.href = destino;
      return;
    }
    if (estado.pecas === 0) {
      avisar('Seu carrinho est\u00e1 vazio. O pedido m\u00ednimo \u00e9 de ' + brl.format(MINIMO) + '.');
    } else {
      avisar('Faltam ' + brl.format(falta()) + ' para o pedido m\u00ednimo de ' + brl.format(MINIMO) + '.');
    }
    if (!carrinhoAberto() && estado.pecas > 0) abrirCarrinho();
    tremer(cfg.hidden ? barra : cfg);
  }

  document.addEventListener('click', function (e) {
    var alvo = e.target;
    var a = alvo && alvo.closest ? alvo.closest('a[href]') : null;

    if (a && a.classList.contains('sv-barra-botao') && !liberado()) {
      e.preventDefault();
      abrirCarrinho();
      return;
    }
    if (!a || !levaAoCheckout(a)) return;
    if (liberado()) return;

    e.preventDefault();
    e.stopPropagation();
    var destino = a.href;
    lerCarrinho().then(function () { barrar(destino); });
  }, true);

  // ---------- quando reler ----------
  var observador = new MutationObserver(agendarLeitura);
  ['.cart-sidebar .total .value', '.cart-sidebar .content-cart .list', '[data-cart="amount"]'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (n) {
      observador.observe(n, { childList: true, characterData: true, subtree: true });
    });
  });
  if (carrinhoLateral) {
    new MutationObserver(atualizarVisibilidadeBarra).observe(carrinhoLateral, { attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) agendarLeitura(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) agendarLeitura(); });

  // Para codigo que vai ao carrinho por location.href, sem clique em link
  // (ex.: "Compre junto" em snippets/sv-global.html): passa pela mesma trava.
  window.svIrAoCarrinho = function (destino) {
    lerCarrinho().then(function () { barrar(destino); });
  };

  lerCarrinho();
})();
