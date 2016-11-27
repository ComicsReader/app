import { take, put, call, fork, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import * as t from 'constants/ActionTypes';
import { getComicManager, getSearchState, getComicID } from 'reducers/selectors';
import { comicManagers } from 'services';
import { push } from 'react-router-redux';
import { updateReadingRecord } from 'actions/ConfigActions';

// default comics service
const DM5 = comicManagers.dm5;

let dispatch;

function* switchChapter(action) {
	const { chapterItem } = action;
	const comicManager = yield select(getComicManager);
	const comicID = yield select(getComicID);

	let { chapterID } = chapterItem;

	let pathname = `/reader/${comicManager.siteName}/${chapterID}`;

	yield put({type: t.CLEAR_COMIC_IMAGES});
	yield put({type: t.NAVIGATE, pathname});

	console.log('updateReadingRecord in switchChapter');
	updateReadingRecord({comicID, chapterID})(dispatch);

	// may failed...
	const images = yield call(comicManager.getChapterImages, chapterID);

	yield put({
		type: t.SWITCH_CHAPTER,
		readingImages: [images],
		appBarTitle: chapterItem.title,
		siteName: comicManager.siteName,
		readingChapterID: chapterID
	});
}

function* watchSwitchChapter() {
	yield* takeLatest(t.SWITCH_CHAPTER_REQUEST, switchChapter);
}

function* searchComics(action) {
	const {page=1} = action;
	yield put({type: t.SHOW_LOAD_INDICATOR});

	try {
		const { currentPage: previousPage, searchKeyword } = yield select(getSearchState);
		const {comics, currentPage, totalPage} = yield DM5.search(searchKeyword, page);

		if (currentPage > previousPage) {
			yield put({
				type: t.APPEND_SEARCH_RESULTS,
				searchKeyword,
				comics,
				currentPage,
				totalPage
			});
		} else {
			yield put({type: t.CLEAR_SEARCH_RESULT});
			yield put({
				type: t.REPLACE_SEARCH_RESULTS,
				searchKeyword,
				comics,
				currentPage,
				totalPage
			});
		}
	} catch(e) {
		yield put({type: t.HIDE_LOAD_INDICATOR});
	}
}

function* watchSearchComics() {
	yield* takeLatest(t.SEARCH_COMIC_REQUEST, searchComics);
}

function* watchNavigate() {
	while(true) {
		const {pathname} = yield take(t.NAVIGATE);
		yield put(push(pathname));
	}
}

export default function* root(dis) {
	dispatch = dis;
	yield [
		fork(watchSwitchChapter),
		fork(watchNavigate),
		fork(watchSearchComics)
	];
}
