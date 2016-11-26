import * as t from 'constants/ActionTypes';
import { comicManagers } from 'services';
import { addRecentComic, updateReadingRecord } from 'actions/ConfigActions';
import { replaceChapterCache } from 'actions';

export const initComicManager = ({site, chapterID, readingChapterID}) => {
	return (dispatch, getState) => {
		let comicManager = comicManagers.selectComicManager(site);

		comicManager.getComic(chapterID).then(comicInfo => {
			const {
				comicID,
				comicName,
				coverImage,
				chapters,
				latestChapter
			} = comicInfo;

			if (chapterID === readingChapterID) {
				return;
			}

			dispatch({type: t.CLEAR_COMIC_IMAGES});

			addRecentComic({comicID, coverImage, comicName, latestChapter})(dispatch);
			updateReadingRecord({comicID, chapterID})(dispatch);
			replaceChapterCache({comicID, chapters});

			dispatch({
				type: t.SET_COMIC_NAME,
				comicName: comicName
			});

			dispatch({
				type: t.INIT_COMIC_MANAGER,
				comicManager: comicManager,
				chapters: chapters,
				comicID: comicID
			});

			const { readingRecord } = getState().config;

			/* load last read chapter */
			if (typeof readingRecord[comicID] !== 'undefined') {
				const { _id, _rev, ...readingComicRecord } = readingRecord[comicID];
				const reverseRecordMap = Object.keys(readingComicRecord).reduce((prev, cur) => {
					return {...prev, [readingComicRecord[cur]]: cur};
				}, {});
				const lastChapterID = reverseRecordMap[Math.max(...Object.keys(reverseRecordMap))];
				chapterID = lastChapterID;
			}

			comicManager.getChapterImages(chapterID).then(images => {
				let chapterItem = chapters.find(item => item.chapterID == chapterID);

				dispatch({
					type: t.SWITCH_CHAPTER,
					readingChapters: [chapterItem],
					readingImages: [images],
					appBarTitle: chapterItem.title,
					readingChapterID: chapterID
				});
			});
		});
	};
};

export const switchChapter = (chapterItem) => {
	return dispatch => {
		dispatch({type: t.SWITCH_CHAPTER_REQUEST, chapterItem});
	};
};
