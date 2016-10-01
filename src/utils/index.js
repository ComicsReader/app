import store from 'store';
import uuid from 'node-uuid';
import later from 'later';

function initDeviceID() {
	let deviceID = store.get('device_id');
	if (!deviceID) {
		store.set('device_id', uuid.v4());
	}
}

function setupWorker() {
	// var sched = later.parse.cron('1/1 * * * *');
	var sched = later.parse.cron('0,30 * * * *');
	later.setInterval(runWorker, sched);
}

function runWorker() {
	var deviceID = store.get('device_id');
	let worker = new Worker('./js/worker.js');

	worker.onmessage = (e) => {
		// TODO: update update records
		const { unreadChapters, comicID } = e.data;
		// console.log(unreadChapters.length);

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

	// start worker
	worker.postMessage({deviceID});
}

export function initializeApp({callback}) {
	initDeviceID();
	setupWorker();

	callback();
}
