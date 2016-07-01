import {dm5} from './services/comics';
import queryString from 'query-string';

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
		let chapter = dm5.regex.exec(details.url)[1];
		chrome.tabs.update(details.tabId, {
			url: chrome.extension.getURL('index.html') + `#/reader/dm5/${chapter.replace(/\//g, '')}`
		});
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
