import { firebaseApp } from 'utils/firebase';
import * as t from 'constants/ActionTypes';
import store from 'store';

const deviceID = store.get('device_id');

const Collection = firebaseApp.database().ref(`users/${deviceID}/collections/`);

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
