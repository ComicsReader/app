import store from 'store';
import uuid from 'node-uuid';
import later from 'later';
import * as t from 'constants/ActionTypes';
import { markNotificationSent } from 'actions';

let worker;
let applicationStore; // save redux store  reference

export function initDeviceID() {
	let deviceID = store.get('device_id');
	if (!deviceID) {
		store.set('device_id', uuid.v4());
	}
}

export function setupWorker(workerFunction) {
	// var sched = later.parse.cron('1/1 * * * *'); // test only, scheduled every minute
	var sched = later.parse.cron('1/15 * * * *');
	later.setInterval(workerFunction, sched);
}

export function sendNotification({ unreadChapters, comicName, comicID, coverImage, onClick }) {
	for (let chapter of unreadChapters) {
		let title = chapter.title.replace(new RegExp(`${comicName}`), '');
		let notification = new Notification('漫畫更新', {
			body: `${comicName} ${title} 更新了，點此閱讀`,
			icon: coverImage
		});

		notification.onclick = () => {
			onClick(chapter)();
			notification.close();

			if (typeof chrome !== 'undefined') {
				chrome.runtime.sendMessage({eventType: 'notification_clicked'});
			}
		};

		markNotificationSent({comicID, chapterID: chapter.chapterID});
	}
}

function runWorker() {
	var deviceID = store.get('device_id');

	if (typeof worker !== 'undefined') { worker.terminate(); }
	worker = new Worker('./js/worker.js');

	worker.onmessage = (e) => {
		sendNotification({...e.data, onClick: (chapter) => {
			let pathname = `/reader/dm5/${chapter.chapterID}`;

			return () => {
				applicationStore.dispatch({type: t.CLEAR_COMIC_IMAGES});
				applicationStore.dispatch({type: t.NAVIGATE, pathname});
			};
		}});

		e.data;
	};

	// start worker
	worker.postMessage({deviceID});
}

export function initializeApp({callback, store}) {
	applicationStore = store;

	initDeviceID();
	setupWorker();

	callback();
}
