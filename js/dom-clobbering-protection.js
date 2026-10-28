/*!
 * DOM Clobbering Protection (CVE-2025-1647)
 *
 * Trava `document.implementation` em sua referencia nativa antes que qualquer
 * conteudo do <body> seja parseado. Sem essa protecao, uma tag como
 * `<form><input name="implementation">` ou `<img name="implementation">`
 * sobrescreve `document.implementation` via DOM clobbering, fazendo o
 * sanitizeHtml do Bootstrap 3 (Tooltip/Popover) cair em fallback e retornar
 * HTML sem sanitizar -> XSS.
 *
 * Este arquivo precisa ser o PRIMEIRO script do bundle, antes do jQuery
 * e do Bootstrap.
 *
 * Referencia: easycheckout#5186 (mesma abordagem).
 */
(function () {
    'use strict';

    if (typeof document === 'undefined') {
        return;
    }

    var nativeImplementation = Object.getOwnPropertyDescriptor(Document.prototype, 'implementation');

    if (nativeImplementation && typeof nativeImplementation.get === 'function') {
        var nativeGetter = nativeImplementation.get;
        try {
            Object.defineProperty(document, 'implementation', {
                configurable: false,
                get: function () {
                    return nativeGetter.call(document);
                }
            });
            return;
        } catch (err) {
            // segue para fallback abaixo
        }
    }

    var nativeRef = document.implementation;
    try {
        Object.defineProperty(document, 'implementation', {
            configurable: false,
            writable: false,
            value: nativeRef
        });
    } catch (err) {
        // navegador nao permite redefinir - nada a fazer
    }
})();
