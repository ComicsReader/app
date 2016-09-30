import * as t from 'constants/ActionTypes';
import { comicManagers } from 'services';
import { addRecentComic } from 'actions/ConfigActions';

export const initComicManager = ({site, chapterID}) => {
	return dispatch => {
		let comicManager = comicManagers.selectComicManager(site);

		dispatch({type: t.CLEAR_COMIC_IMAGES});

		comicManager.getComic(chapterID).then(comicInfo => {
			const {
				comicID,
				comicName,
				coverImage,
				chapters,
				latestChapter
			} = comicInfo;

			addRecentComic({comicID, coverImage, comicName, latestChapter})(dispatch);

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
