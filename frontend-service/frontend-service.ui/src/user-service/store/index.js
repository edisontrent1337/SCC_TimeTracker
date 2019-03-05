import { createStore, applyMiddleware, combineReducers } from 'redux'
import authReducer from '../reducers/authentication.reducer.js';
import signupReducer from '../reducers/signup.reducer.js';
import thunkMiddleware from 'redux-thunk';
const rootReducer = combineReducers({authReducer, signupReducer});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
