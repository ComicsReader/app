/* global chrome */
import {comicManagers} from 'services';
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
	let cookieIndex = details.requestHeaders.findIndex(header => header.name == 'Cookie');
	if (cookieIndex > 0) {
		details.requestHeaders[cookieIndex] = {name: 'Cookie', value: `${details.requestHeaders[cookieIndex]};isAdult=1;`};
	} else {
		details.requestHeaders = [...details.requestHeaders, {
			name: 'Cookie',
			value: 'isAdult=1'
		}];
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

chrome.browserAction.onClicked.addListener(() => {
	chrome.windows.create({
		type: 'popup',
		url: `${chrome.extension.getURL('index.html')}#/explore`
	});
});

chrome.contextMenus.create({
	title: 'Open in new Tab',
	contexts: ['browser_action'],
	onclick: function() {
		chrome.tabs.create({
			url: `${chrome.extension.getURL('index.html')}#/explore`
		});
	}
});
