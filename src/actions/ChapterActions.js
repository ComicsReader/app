import * as t from '../constants/ActionTypes';
import { comicManagers } from '../services';

export const initComicManager = ({site, chapterID}) => {
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

		dispatch({type: t.CLEAR_COMIC_IMAGES});

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
						appBarTitle: chapterItem.title,
						readingCID: chapterItem.cid
					});
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
