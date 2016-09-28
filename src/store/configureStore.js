import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducer from 'reducers';
import createLogger from 'redux-logger';
import { history } from 'services';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist';

const logger = createLogger();

export default function configureStore(initialState) {
	const sagaMiddleware = createSagaMiddleware();

	const createStoreWithMiddleware = applyMiddleware(
		sagaMiddleware,
		thunk,
		logger,
		routerMiddleware(history)
	)(createStore);

	const store = createStoreWithMiddleware(reducer, initialState, autoRehydrate());
	persistStore(store);

	store.runSaga = sagaMiddleware.run;

	return store;
}
