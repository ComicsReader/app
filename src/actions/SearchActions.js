import * as t from '../constants/ActionTypes';

export function searchComics(keyword) {
	return dispatch => {
		dispatch({
			type: t.SEARCH_COMIC_REQUEST,
			keyword
		});
	};
}
