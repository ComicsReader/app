import { firebaseApp } from 'utils/firebase';
import { comicManagers } from 'services';

function getUnreadChapters({comicID, deviceID}) {
	const ReadingRecord = firebaseApp.database().ref(`users/${deviceID}/readingRecord`);
	return new Promise((resolve) => {
		comicManagers.dm5.getComic(comicID).then(comicInfo => {
			const { chapters } = comicInfo;

			ReadingRecord.once('value').then(snapeshot => {
				console.log(snapeshot.val());
				if (snapeshot && snapeshot.val()) {
					let readingRecord = snapeshot.val()[comicID];
					resolve(chapters.filter(chapter => typeof readingRecord[chapter.chapterID] === 'undefined' || !readingRecord[chapter.chapterID]));
				} else {
					resolve(chapters);
				}
			});
		});
	});
}

onmessage = (e) => {
	getUnreadChapters(e.data).then(unreadChapters => {
		postMessage({unreadChapters});
	});

};
