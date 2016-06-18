import { createStore } from 'redux';
import reducer from '../reducers';

export default function configureStore(initialState) {
  return createStore(reducer, initialState);
};
