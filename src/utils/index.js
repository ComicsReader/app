import store from 'store';
import uuid from 'node-uuid';

export function initializeDeviceId({callback}) {
	let deviceID = store.get('device_id');
	if (!deviceID) {
		store.set('device_id', uuid.v4());
	}

	callback();
}
