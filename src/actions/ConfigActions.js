import { firebaseApp } from 'utils/firebase';
import * as t from 'constants/ActionTypes';

import store from 'store';

let deviceID = store.get('device_id');

const Collection = firebaseApp.database().ref(`users/${deviceID}/collections/`);
const RecentComic = firebaseApp.database().ref(`users/${deviceID}/recentComics/`);

export const fetchCollections = () => {
	return dispatch => {
		Collection.on('value', snapshot => {
			dispatch({
				type: t.FETCH_ALL_COLLECTION,
				collections: snapshot.val() || {}
			});
		});
	};
};

export const turnOffFetchCollectionCallback = () => {
	return dispatch => Collection.off();
};

export const addCollection = (comic) => {
	return dispatch => firebaseApp.database().ref(`users/${deviceID}/collections/${comic.comicID}`).set({...comic, created_at: new Date().getTime()});
};

export const removeCollection = (key, callback=null) => {
	return dispatch => {
		Collection.child(key).remove();
		if (callback) callback();
	};
};

export const fetchRecentComic = () => {
	return dispatch => {
		RecentComic.on('value', snapshot => {
			dispatch({
				type: t.FETCH_RECENT_COMICS,
				recentComics: snapshot.val() || {}
			});
		});
	};
};

export const turnOffFetchRecentComicCallback = () => {
	return dispatch => RecentComic.off();
};

export const addRecentComic = (comic) => {
	return dispatch => firebaseApp.database().ref(`users/${deviceID}/recentComics/${comic.comicID}`).set({...comic, last_read_at: new Date().getTime()});
};

export const removeRecentComic = (key, callback=null) => {
	return dispatch => {
		RecentComic.child(key).remove();
		if (callback) callback();
	};
};

