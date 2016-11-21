import { ReadingRecord, ChapterCache } from 'actions/ConfigActions';

export const markNotificationSent = async ({comicID, chapterID}) => {
	try {
		const readingRecord = await ReadingRecord.get(comicID);
		ReadingRecord.put({
			...readingRecord,
			[chapterID]: 'notification_sent'
		});
	} catch(err) {
		ReadingRecord.put({
			_id: comicID,
			[chapterID]: 'notification_sent'
		});
	}
};

export const replaceChapterCache = async ({comicID, chapters}) => {
	try {
		const chapterCache = await ChapterCache.get(comicID);
		ReadingRecord.put({
			...chapterCache,
			chapters
		});
	} catch(err) {
		ChapterCache.put({
			_id: comicID,
			chapters
		});
	}
};
