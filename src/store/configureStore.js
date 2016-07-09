import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducer from 'reducers';

export default function configureStore(initialState) {
	const sagaMiddleware = createSagaMiddleware();

	const createStoreWithMiddleware = applyMiddleware(
		sagaMiddleware,
		thunk
	)(createStore);

	const store = createStoreWithMiddleware(reducer, initialState);
	store.runSaga = sagaMiddleware.run;

	return store;
}
