import PouchDB from 'pouchdb';
import * as t from 'constants/ActionTypes';

export const Collection = new PouchDB({ name: 'collections' });
export const RecentComic = new PouchDB({ name: 'recentComics' });
export const ReadingRecord = new PouchDB({ name: 'readingRecord' });
export const ChapterCache = new PouchDB({ name: 'chapterCache' });

/* Collection Resource */
export const fetchCollections = () => {
	return dispatch => {
		Collection.allDocs({
			include_docs: true
		}).then(({rows: data}) => {
			const collections = data.reduce((prev, cur) => {
				return {...prev, [cur.doc.comicID]: cur.doc};
			}, {}) || {};
			dispatch({
				type: t.FETCH_ALL_COLLECTION,
				collections
			});
		});
	};
};

export const turnOffFetchCollectionCallback = () => {
	// console.log('turnOffFetchCollectionCallback');
	return dispatch => {
	// 	CollectionChanges && CollectionChanges.cancel();
	// 	CollectionChanges = null;
	};
};

export const addCollection = (comic) => {
	return dispatch => {
		Collection.get(comic.comicID).catch(err => {
			Collection.put({
				_id: comic.comicID,
				...comic,
				created_at: new Date().getTime()
			}).then(() => {
				fetchCollections()(dispatch);
			}).catch(err => {
				console.log(`errr: ${err}`);
			});
		});
	};
};

export const removeCollection = (key, callback=null) => {
	return dispatch => {
		Collection.get(key).then(comic => {
			Collection.remove(comic).then(() => {
				fetchCollections()(dispatch);
				if (callback) callback();
			});
		});
	};
};

/* RecentComic Resource */
export const fetchRecentComic = () => {
	return dispatch => {
		RecentComic.allDocs({
			include_docs: true
		}).then(({rows: data}) => {
			const recentComics = data.reduce((prev, cur) => {
				return {...prev, [cur.doc.comicID]: cur.doc};
			}, {}) || {};
			dispatch({
				type: t.FETCH_RECENT_COMICS,
				recentComics
			});
		});
	};
};

export const turnOffFetchRecentComicCallback = () => {
	return dispatch => {
		// RecentComicChanges && RecentComicChanges.cancel();
		// CollectionChanges = null;
	};
};

export const addRecentComic = (comic) => {
	return dispatch => {
		RecentComic.get(comic.comicID).catch(err => {
			RecentComic.put({
				_id: comic.comicID,
				...comic,
				last_read_at: new Date().getTime()
			}).then(() => {
				fetchRecentComic()(dispatch);
			}).catch(err => {
				console.log(`errr: ${err}`);
			});
		});
	};
};

export const removeRecentComic = (key, callback=null) => {
	return dispatch => {
		RecentComic.get(key).then(comic => {
			RecentComic.remove(comic).then(() => {
				fetchRecentComic()(dispatch);
				if (callback) callback();
			});
		});
	};
};

/* Reading Resource */
export const fetchReadingAction = () => {
	return new Promise(resolve => {
		ReadingRecord.allDocs({
			include_docs: true
		}).then(({rows: data}) => {
			const readingRecord = data.reduce((prev, cur) => {
				return {...prev, [cur.doc._id]: cur.doc};
			}, {}) || {};

			resolve({
				type: t.FETCH_READING_RECORD,
				readingRecord
			});
		});
	});

};

export const fetchReadingRecord = () => {
	return dispatch => {
		fetchReadingAction().then(action => {
			dispatch(action);
		});
	};
};

export const updateReadingRecord = ({comicID, chapterID}) => {
	return async dispatch => {
		try {
			const readingRecord = await ReadingRecord.get(comicID);
			await ReadingRecord.put({
				_id: comicID,
				...readingRecord,
				[chapterID]: new Date().getTime()
			});
		} catch(err) {
			await ReadingRecord.put({
				_id: comicID,
				[chapterID]: new Date().getTime()
			});
		}

		fetchReadingRecord()(dispatch);
	};
};

/* ChapterCache Resource */
export const fetchChapterCache = () => {
	return dispatch => {
		ChapterCache.allDocs({
			include_docs: true
		}).then(({rows: data}) => {
			const chapterCache = data.reduce((prev, cur) => {
				return {...prev, [cur.doc.comicID]: cur.doc};
			}, {}) || {};
			dispatch({
				type: t.FETCH_CHAPTER_CACHE,
				chapterCache
			});
		});
	};
};
