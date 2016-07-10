import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducer from 'reducers';
import createLogger from 'redux-logger';

const logger = createLogger();

export default function configureStore(initialState) {
	const sagaMiddleware = createSagaMiddleware();

	const createStoreWithMiddleware = applyMiddleware(
		sagaMiddleware,
		thunk,
		logger
	)(createStore);

	const store = createStoreWithMiddleware(reducer, initialState);
	store.runSaga = sagaMiddleware.run;

	return store;
}
