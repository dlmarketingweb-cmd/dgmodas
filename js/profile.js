(function(){
    var elements = {};

    jQuery(document).ready(function() {
        jQuery('html').on( "tray-session", function() {
            setCookie();
        });
    });

    function getStoreID() {
        return document.querySelector('html').getAttribute('data-store') ||
            getCurrentScript().getAttribute('data-store');
    }

    function getCurrentScript() {
        if (!elements.currentScript) {
            elements.currentScript = document.getElementById('pageview-script');
        }

        return elements.currentScript;
    }

    function setCookie() {
        let sessionID = document.querySelector('html').getAttribute('data-session');
        jQuery.ajax({
            type: 'GET',
            url: '/nocache/profile.php?loja=' + getStoreID() + '&url=' + encodeURIComponent(document.location.href) + '&session_id=' + sessionID + '&hash=' + Date.now(),
            success: function(returnData) {
                if (!returnData || returnData.status != 'sucess') {
                    return;
                }
            },
            dataType: 'json'
        });
    }
})();
