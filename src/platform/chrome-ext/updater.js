import store from 'store';
import { initDeviceID, setupWorker } from 'utils';
import { markNotificationSent } from 'actions';

let worker;
let notificationCallback;

export function initializeUpdater(callback) {
	initDeviceID();

	notificationCallback = callback;
	setupWorker(runWorker);
	runWorker();
}

function sendNotification({ unreadChapters, comicName, comicID, coverImage, onClick }) {
	for (let chapter of unreadChapters) {
		let title = chapter.title.replace(new RegExp(`${comicName}`), '');
		// FIXME: notifications sent from background.js would result bad encoding
		let notification = new Notification('Comic Updates', {
			body: `${comicName} ${title} updates!`,
			icon: coverImage
		});

		notification.onclick = () => {
			onClick(chapter)();
			notification.close();

			chrome.runtime.sendMessage({eventType: 'notification_clicked'});
		};

		markNotificationSent({comicID, chapterID: chapter.chapterID});
	}
}

function runWorker() {
	let deviceID = store.get('device_id');
	if (typeof worker !== 'undefined') { worker.terminate(); }
	worker = new Worker('./js/worker.js');

	worker.onmessage = (e) => {
		sendNotification({...e.data, onClick: (chapter) => {
			let url = `${chrome.extension.getURL('index.html')}#/reader/dm5/${chapter.chapterID}`;

			return () => {
				notificationCallback(url, {replace: true});
			};
		}});

		e.data;
	};

	// start worker
	worker.postMessage({deviceID});
}
