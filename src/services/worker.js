import { firebaseApp } from 'utils/firebase';
import { comicManagers } from 'services';

function getUnreadChapters({comicID, deviceID}) {
	const ReadingRecord = firebaseApp.database().ref(`users/${deviceID}/readingRecord/`);
	return new Promise((resolve) => {
		comicManagers.dm5.getComic(comicID).then(comicInfo => {
			const { chapters } = comicInfo;

			ReadingRecord.once('value').then(snapeshot => {
				if (snapeshot && snapeshot.val()) {
					let readingRecord = snapeshot.val()[comicID];

					if (typeof readingRecord === 'undefined') {
						resolve(chapters);
					} else {
						resolve(chapters.filter(chapter => typeof readingRecord[chapter.chapterID] === 'undefined' || !readingRecord[chapter.chapterID]));
					}
				} else {
					resolve(chapters);
				}
			});
		});
	});
}

onmessage = (e) => {
	const { deviceID } = e.data;
	const Collection = firebaseApp.database().ref(`users/${deviceID}/collections/`);

	Collection.once('value').then(snapshot => {
		if (snapshot && snapshot.val()) {
			for (let comicID of Object.keys(snapshot.val())) {
				getUnreadChapters({comicID, deviceID}).then(unreadChapters => {
					postMessage({comicID, unreadChapters});
				});
			}
		}
		// TODO collect all promise and #close when all done
	});
};
