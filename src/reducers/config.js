import * as t from 'constants/ActionTypes';

const initialState = {
	collections: {},
	recentComics: {}
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
	default:
		return state;
	}
}
