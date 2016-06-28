import { take, put, call, fork, select } from 'redux-saga/effects';
import { takeEvery, takeLatest } from 'redux-saga';
import * as t from '../constants/ActionTypes';
import { getComicManager, getSearchState } from '../reducers/selectors';
import { history } from '../services';
import { comicManagers } from '../services';

// default comics service
const DM5 = comicManagers.dm5;

function* switchChapter(action) {
	const { chapterItem } = action;
	const comicManager = yield select(getComicManager);

	let pathname = `/reader/${comicManager.siteName}/${comicManager.getChapterID(chapterItem.cid)}`;

	yield put({type: t.CLEAR_COMIC_IMAGES});
	yield put({type: t.NAVIGATE, pathname});

	// may failed...
	const images = yield call(comicManager.getChapterImages, chapterItem.cid);

	yield put({
		type: t.SWITCH_CHAPTER,
		readingImages: [images],
		appBarTitle: chapterItem.title,
		siteName: comicManager.siteName,
		readingCID: chapterItem.cid
	});
}

function* watchSwitchChapter() {
	yield* takeLatest(t.SWITCH_CHAPTER_REQUEST, switchChapter);
}

function* searchComics(action) {
	const {keyword, page=1} = action;

	yield put({type: t.SHOW_LOAD_INDICATOR});

	const {comics, currentPage, totalPage} = yield DM5.search(keyword, page);
	const { currentPage: previousPage } = yield select(getSearchState);

	if (previousPage == null || (previousPage == currentPage && currentPage == 1)) {
		yield put({
			type: t.REPLACE_SEARCH_RESULTS,
			comics,
			currentPage,
			totalPage
		});

	} else if (currentPage > previousPage) {
		yield put({
			type: t.APPEND_SEARCH_RESULTS,
			comics,
			currentPage,
			totalPage
		});
	} else {
		yield;
	}
}

function* watchSearchComics() {
	yield* takeLatest(t.SEARCH_COMIC_REQUEST, searchComics);
}

function* watchNavigate() {
	while(true) {
		const {pathname} = yield take(t.NAVIGATE);
		yield history.push(pathname);
	}
}

export default function* root() {
	yield [
		fork(watchSwitchChapter),
		fork(watchNavigate),
		fork(watchSearchComics)
	];
}
