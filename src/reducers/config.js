import * as t from 'constants/ActionTypes';

const initialState = {
	collections: {},
	recentComics: {},
	readingRecord: {},
	chapterCache: {}
};

export default function config(state = initialState , action) {
	switch(action.type) {
	case t.FETCH_ALL_COLLECTION:
		return {
			...state,
			collections: action.collections
		};
	case t.FETCH_RECENT_COMICS:
		return {
			...state,
			recentComics: action.recentComics
		};
	case t.FETCH_READING_RECORD:
		return {
			...state,
			readingRecord: action.readingRecord
		};
	case t.FETCH_CHAPTER_CACHE:
		return {
			...state,
			chapterCache: action.chapterCache
		};
	default:
		return state;
	}
}
