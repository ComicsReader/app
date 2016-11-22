import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducer from 'reducers';
import createLogger from 'redux-logger';
import { history } from 'services';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';

const logger = createLogger();

export default function configureStore(initialState) {
	const sagaMiddleware = createSagaMiddleware();

	const store = createStore(
		reducer,
		initialState,
		composeWithDevTools(
			applyMiddleware(
				sagaMiddleware,
				thunk,
				logger,
				routerMiddleware(history)
			),
			autoRehydrate()
		)
	);

	persistStore(store);

	store.runSaga = sagaMiddleware.run;

	return store;
}
