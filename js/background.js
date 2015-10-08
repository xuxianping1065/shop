function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if(getDomainFromUrl(tab.url).toLowerCase().indexOf("auction.jd.com") != -1){
		chrome.pageAction.show(tabId);
		
		//chrome.tabs.executeScript({
		//	code: 'document.body.innerHTML="code"'
		//  });

	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

var fixedprice;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd=='setFixedPrice'){
		fixedprice=request.fixedprice;
		
	}else if(request.cmd=='getFixedPrice'){
		sendResponse({'fixedprice':fixedprice});	
	}
});
