import * as t from 'constants/ActionTypes';

export function toggleAppDrawer() {
	return {type: t.TOGGLE_APP_DRAWER};
}

export function increaseZoomRate() {
	return {type: t.INCREASE_ZOOM_RATE};
}

export function decreaseZoomRate() {
	return {type: t.DECREASE_ZOOM_RATE};
}

export function resetZoomRate() {
	return {type: t.RESET_ZOOM_RATE};
}
