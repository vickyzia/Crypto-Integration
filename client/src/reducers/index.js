import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import paymentReducer from './paymentReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  payment: paymentReducer
});
