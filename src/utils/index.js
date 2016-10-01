import store from 'store';
import uuid from 'node-uuid';

function initDeviceID() {
	let deviceID = store.get('device_id');
	if (!deviceID) {
		store.set('device_id', uuid.v4());
	}
}

export function initializeApp({callback}) {
	initDeviceID();

	var deviceID = store.get('device_id');
	let worker = new Worker('./js/worker.js');
	worker.postMessage({comicID: 'manhua-wodeyingxiongxueyuan', deviceID});

	worker.onmessage = (e) => {
		// TODO: update update records
		console.log(e.data.unreadChapters.length);

		switch(window.PLATFORM) {
		case 'electron':
			// TODO: create native notification
			// var { ipcRenderer } = require('electron');

			break;
		case 'chrome_extension':
			// TODO create chrome notification

			break;
		default:
			throw 'Unsupported Platform';
		}

	};

	callback();
}
