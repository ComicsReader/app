import * as t from '../constants/ActionTypes';

const initialState = {
	drawerOpen: false
};

export default function ui(state = initialState, action) {
	switch(action.type) {
	case t.TOGGLE_APP_DRAWER:
		return {
			...state,
			drawerOpen: !state.drawerOpen
		};

	case t.CHANGE_DRAWER_STATE:
		return {
			...state,
			drawerOpen: action.drawerOpen
		};

	default:
		return state;
	}
}
