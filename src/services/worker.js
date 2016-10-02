import { firebaseApp } from 'utils/firebase';
import { comicManagers } from 'services';

function getUnreadChapters({comicID, deviceID}) {
	const ReadingRecord = firebaseApp.database().ref(`users/${deviceID}/readingRecord/${comicID}`);
	const ChapterCache = firebaseApp.database().ref(`users/${deviceID}/chapterCache/${comicID}`);

	return new Promise((resolve) => {
		comicManagers.dm5.getComic(comicID).then(comicInfo => {
			const { chapters, coverImage, comicName } = comicInfo;

			ReadingRecord.once('value').then(snapeshot => {
				let readingRecord = snapeshot.val();

				const notificationSent = (chapterItem) => {
					return readingRecord && readingRecord[chapterItem.chapterID] && readingRecord[chapterItem.chapterID] === 'notification_sent';
				};

				ChapterCache.once('value').then(snapeshot => {
					let chapterCache = {...snapeshot.val()};
					ChapterCache.set(chapters);

					if (typeof chapterCache === 'undefined' || !chapterCache) {
						if (typeof readingRecord === 'undefined' || !readingRecord) {
							// haven't read it yet, just report the latest chapter
							resolve({unreadChapters: chapters.slice(0, 1), comicName, coverImage});
						} else {
							// no chapterCache yet, my happen on upgrade version
							resolve({unreadChapters: chapters.slice(0, 1).filter(notificationSent), comicName, coverImage});
						}
					} else {
						if (typeof readingRecord === 'undefined' || !readingRecord) {
							// haven't read it yet, just report the latest chapter
							resolve({unreadChapters: chapters.slice(0, 1), coverImage, comicName});
						} else {
							if (chapters.length > chapterCache.length) {
								// has update chapters! Let's report them
								let index = chapters.findIndex(chapter => chapter.chapterID === chapterCache[0].chapterID);

								if (index != -1 && index > 0) {
									resolve({unreadChapters: chapters.slice(0, index).filter(notificationSent), coverImage, comicName});
								} else {
									// some problem, still report latest chapter
									resolve({unreadChapters: chapters.slice(0, 1).filter(notificationSent), coverImage, comicName});
								}
							} else {
								if (chapters[0].chapterID === chapterCache[0].chapterID) {
									// no updates!
									resolve({unreadChapters: [], coverImage, comicName});
								} else {
									// some problem, still report latest chapter
									resolve({unreadChapters: chapters.slice(0, 1).filter(notificationSent), coverImage, comicName});
								}
							}
						}
					}
				});
			});
		});
	});
}

export function updateCollection({deviceID, afterEachCallback}) {
	const Collection = firebaseApp.database().ref(`users/${deviceID}/collections/`);

	Collection.once('value').then(snapshot => {
		if (snapshot && snapshot.val()) {
			for (let comicID of Object.keys(snapshot.val()).slice(7, 10)) {
				getUnreadChapters({comicID, deviceID}).then(data => {
					afterEachCallback({comicID, ...data});
				});
			}
		}
	});
}

onmessage = (e) => {
	const { deviceID } = e.data;

	updateCollection({deviceID, afterEachCallback: (data) => {
		postMessage(data);
	}});
};
