import * as t from '../constants/ActionTypes';
import comicManagers from '../comics';

export const initComicManager = (site, chapterID) => {
	return dispatch => {
		let comicManager = null;

		switch(site) {
		case 'dm5':
			comicManager = comicManagers.dm5;
			break;
		default:
			comicManager = comicManagers.dm5;
			break;
		}

		comicManager.fetchComicIDbyChapterID(chapterID).then(comicID => {
			comicManager.getComicName(comicID).then(comicName => {
				dispatch({
					type: t.SET_COMIC_NAME,
					comicName: comicName
				});
			});

			comicManager.getChapters(comicID).then(chapters => {
				dispatch({
					type: t.INIT_COMIC_MANAGER,
					comicManager: comicManager,
					chapters: chapters,
					comicID: comicID
				});

				comicManager.getChapterImages(comicManager.getCID(chapterID)).then(images => {
					let chapterItem = chapters.find(chap => chap.cid == comicManager.getCID(chapterID));
					dispatch({
						type: t.SWITCH_CHAPTER,
						readingChapters: [chapterItem],
						readingImages: [images],
						appBarTitle: chapterItem.title
					});
				});
			});
		});
	};
};

export const switchChapter = ({comicManager, chapterItem, chapters, history}) => {
	return dispatch => {
		history.push(`/reader/${comicManager.siteName}/${comicManager.getChapterID(chapterItem.cid)}`);
		dispatch({
			type: t.SWITCH_CHAPTER,
			readingImages: [],
			appBarTitle: chapterItem.title
		});

		comicManager.getChapterImages(chapterItem.cid).then(images => {
			dispatch({
				type: t.SWITCH_CHAPTER,
				readingImages: [images],
				appBarTitle: chapterItem.title
			});
		});
	};
};

export const switchToNextChapter = (comicManager, comics, curIndex) => {
	return dispatch => {

	};
};

