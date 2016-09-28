import * as t from 'constants/ActionTypes';

const initialState = {
	drawerOpen: false,
	zommRate: 0
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

	case t.INCREASE_ZOOM_RATE:
		return {
			...state,
			zoomRate: state.zoomRate + 10
		};

	case t.DECREASE_ZOOM_RATE:
		return {
			...state,
			zoomRate: state.zoomRate - 10
		};

	case t.RESET_ZOOM_RATE:
		return {
			...state,
			zoomRate: 0
		};

	default:
		return state;
	}
}
