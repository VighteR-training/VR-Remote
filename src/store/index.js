import thunk from 'redux-thunk';
import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';

import {
  gyroscopeReducer,
  gyroscopeArrayReducer
} from '../reducers/gyroscopeReducer';

const store = combineReducers({
  gyroscopeReducer,
  gyroscopeArrayReducer
});

export default createStore(store, applyMiddleware(thunk))