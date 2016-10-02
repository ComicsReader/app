/* global chrome */
import {comicManagers} from 'services';
const { dm5 } = comicManagers;
import { initializeUpdater } from './updater.js';

let windowID;

initializeUpdater(createOrUpdateUrl);

function createOrUpdateUrl(url, options={}) {
	if (windowID) {
		if (options.replace) {
			chrome.runtime.sendMessage({eventType: 'content_url_changed', url: url});
		}
		chrome.windows.update(windowID, {
			focused: true,
			...windowRect()
		});
	} else {
		chrome.windows.create({
			type: 'popup',
			url: url,
			...windowRect()
		}, (createdWindow) => {
			windowID = createdWindow.id;
		});
	}
}

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

// TODO: save last state when closing window
const windowRect = () => {
	let width  = 1280;
	let height = 900;
	let left   = (screen.width/2)-(width/2);
	let top    = (screen.height/2)-(height/2);

	return({ width, height, left, top });
};

chrome.webNavigation.onCommitted.addListener(function(details) {
	if (dm5.regex.test(details.url)) {
		let chapter = dm5.regex.exec(details.url)[2];

		// TODO: add option for preserving original tab
		chrome.tabs.remove(details.tabId);

		let url = chrome.extension.getURL('index.html') + `#/reader/dm5/${chapter.replace(/\//g, '')}`;

		createOrUpdateUrl(url, {replace: true});
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
	createOrUpdateUrl(`${chrome.extension.getURL('index.html')}#/explore`);
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

chrome.windows.onRemoved.addListener(() => {
	windowID = null;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.eventType == 'notification_clicked') {
		chrome.windows.update(windowID, {focused: true});
	}
});
