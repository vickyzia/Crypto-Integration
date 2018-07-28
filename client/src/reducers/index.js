import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import paymentReducer from './paymentReducer';
import referralReducer from './referralReducer';
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  payment: paymentReducer,
  referrals: referralReducer
});
