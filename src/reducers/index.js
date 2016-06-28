import { combineReducers } from 'redux';
import comics from './comic';
import searchState from './search';

const rootReducer = combineReducers({
	comics,
	searchState
});

export default rootReducer;
