import { firebaseApp } from 'utils/firebase';
import { comicManagers } from 'services';

function getUnreadChapters({comicID, deviceID}) {
	const ReadingRecord = firebaseApp.database().ref(`users/${deviceID}/readingRecord/${comicID}`);
	const ChapterCache = firebaseApp.database().ref(`users/${deviceID}/chapterCache/${comicID}`);

	return new Promise((resolve) => {
		comicManagers.dm5.getComic(comicID).then(comicInfo => {
			const { chapters } = comicInfo;

			ReadingRecord.once('value').then(snapeshot => {
				let readingRecord = snapeshot.val();

				const notificationSent = (chapterItem) => {
					return readingRecord && readingRecord[chapterItem.chapterID] && readingRecord[chapterItem.chapterID] === 'notification_sent';
				};

				ChapterCache.once('value').then(snapeshot => {
					let chapterCache = snapeshot.val();

					if (typeof chapterCache === 'undefined' || !chapterCache) {
						if (typeof readingRecord === 'undefined' || !readingRecord) {
							// haven't read it yet, just report the latest chapter
							resolve(chapters.slice(0, 1));
						} else {
							// no chapterCache yet, my happen on upgrade version
							resolve(chapters.slice(0, 1).filter(notificationSent));
						}
					} else {
						if (typeof readingRecord === 'undefined' || !readingRecord) {
							// haven't read it yet, just report the latest chapter
							resolve(chapters.slice(0, 1));
						} else {
							if (chapters.length > chapterCache.length) {
								// has update chapters! Let's report them
								let index = chapters.findIndex(chapter => chapter.chapterID === chapterCache[0].chapterID);

								if (index != -1 && index > 0) {
									resolve(chapters.slice(0, index).filter(notificationSent));
								} else {
									// some problem, still report latest chapter
									resolve(chapters.slice(0, 1).filter(notificationSent));
								}
							} else {
								if (chapters[0].chapterID === chapterCache[0].chapterID) {
									// no updates!
									resolve([]);
								} else {
									// some problem, still report latest chapter
									resolve(chapters.slice(0, 1).filter(notificationSent));
								}
							}
						}
					}
				});
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
