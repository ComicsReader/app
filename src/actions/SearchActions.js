import * as t from 'constants/ActionTypes';

export function searchComics(keyword, page=1) {
	return dispatch => {
		dispatch({
			type: t.SEARCH_COMIC_REQUEST,
			keyword,
			page
		});
	};
}
