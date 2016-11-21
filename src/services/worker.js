import { comicManagers } from 'services';
import { Collection, ReadingRecord, ChapterCache } from 'actions/ConfigActions';

async function getUnreadChapters({comicID, deviceID}) {
	const { chapters, coverImage, comicName } = await comicManagers.dm5.getComic(comicID);

	let readingRecord, chapterCache;

	const notificationSent = (chapterItem) => {
		return readingRecord && readingRecord[chapterItem.chapterID] && readingRecord[chapterItem.chapterID] === 'notification_sent';
	};

	try {
		readingRecord = await ReadingRecord.get(comicID);
	} catch(err) { /* */ }

	try {
		const { chapters } = await ChapterCache.get(comicID);
		chapterCache = chapters;
	} catch(err) { /* */ }

	try {
		if (typeof chapterCache === 'undefined') {
			await ChapterCache.put({
				_id: comicID,
				chapters
			});
		}

		return new Promise(resolve => {
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
	} catch(err) {
		console.log(`worker error: ${err}`);
	}
}

export function updateCollection({deviceID, afterEachCallback}) {
	Collection.allDocs({
		include_docs: true
	}).then(({rows: data}) => {
		const collections = data.reduce((prev, cur) => {
			return {...prev, [cur.doc.comicID]: cur.doc};
		}, {}) || {};

		for (let comicID of Object.keys(collections)) {
			getUnreadChapters({comicID, deviceID}).then(data => {
				afterEachCallback({comicID, ...data});
			});
		}
	});
}

onmessage = (e) => {
	const { deviceID } = e.data;

	updateCollection({deviceID, afterEachCallback: (data) => {
		postMessage(data);
	}});
};
