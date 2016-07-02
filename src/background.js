import {comicManagers} from './services';
const { dm5 } = comicManagers;

let windowID;

let chapterfunhandler = function(details) {
	details.requestHeaders.push({
		name: 'Referer',
		value: 'http://www.dm5.com/'
	});
	return {
		requestHeaders: details.requestHeaders
	};
};

let mhandler = function(details) {
	for (let i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === 'Cookie') {
			details.requestHeaders[i].value += ';isAdult=1';
			break;
		}
	}
	return {
		requestHeaders: details.requestHeaders
	};
};

chrome.webRequest.onBeforeSendHeaders.addListener(chapterfunhandler, {
	urls: ['http://www.dm5.com/m*/chapterfun*']
}, ['requestHeaders', 'blocking']);

chrome.webRequest.onBeforeSendHeaders.addListener(mhandler, {
	urls: ['http://www.dm5.com/m*/']
}, ['requestHeaders', 'blocking']);

chrome.webNavigation.onCommitted.addListener(function(details) {
	if (dm5.regex.test(details.url)) {
		let chapter = dm5.regex.exec(details.url)[2];
		chrome.tabs.remove(details.tabId);

		let url = chrome.extension.getURL('index.html') + `#/reader/dm5/${chapter.replace(/\//g, '')}`;

		if (windowID) {
			chrome.windows.update(windowID, {
				type: 'popup',
				url: url
			});
		} else {
			windowID = chrome.windows.create({
				type: 'popup',
				url: url
			});
		}
	}
}, {
	url: [{
		urlMatches: 'comicbus\.com/online/\w*'
	}, {
		urlMatches: 'comic\.sfacg\.com\/HTML\/[^\/]+\/.+$'
	}, {
		urlMatches: 'http://(tel||www)\.dm5\.com/m\d*'
	}]
});
