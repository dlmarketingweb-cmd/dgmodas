	var updateData = {"visitorLoginState":"No","visitorId":"oc03d2p4nl49v4usd42c16sjei","visitorSessionID":"oc03d2p4nl49v4usd42c16sjei","visitorType":"new customer","visitorLifetimeValue":0};

window.onload = function() {
	var eventObj = {
	"event": "tray.updateGTM"
	};
	updateData = jQuery.extend(updateData, {
		"siteSearchFrom": document.referrer
	});
	dataLayer.push(jQuery.extend(eventObj, updateData));

	console.info('[DataLayer] UpdateGTM executed.')
};
