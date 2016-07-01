import * as t from '../constants/ActionTypes';

const initialState = {
	comics: [],
	currentPage: null,
	totalPage: null,
	isLoading: false,

	searchKeyword: null,
	searchCache: {}
};

export default function searchState(state = initialState, action) {
	switch (action.type) {
	case t.SHOW_LOAD_INDICATOR:
		return {
			...state,
			isLoading: true
		};

	case t.HIDE_LOAD_INDICATOR:
		return {
			...state,
			isLoading: false
		};

	case t.CLEAR_SEARCH_RESULT:
		return {
			...state,
			comics: []
		};

	case t.APPEND_SEARCH_RESULTS:
		return {
			...state,
			searchKeyword: action.searchKeyword,
			currentPage: action.currentPage,
			totalPage: action.totalPage,
			comics: [...state.comics, ...action.comics],
			isLoading: false
		};

	case t.REPLACE_SEARCH_RESULTS:
		return {
			...state,
			searchKeyword: action.searchKeyword,
			currentPage: action.currentPage,
			totalPage: action.totalPage,
			comics: action.comics,
			isLoading: false
		};

	default:
		return state;
	}
}
