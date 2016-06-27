import { take, put, call, fork, select } from 'redux-saga/effects';
import { takeEvery, takeLatest } from 'redux-saga';
import * as t from '../constants/ActionTypes';
import { getComicManager } from '../reducers/selectors';
import { history } from '../services';

function* watchSwitchChapter() {
	while(true) {
		const {chapterItem} = yield take(t.SWITCH_CHAPTER_REQUEST);
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
		fork(watchNavigate)
	];
}
