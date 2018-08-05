import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import paymentReducer from './paymentReducer';
import referralReducer from './referralReducer';
import adminReducer from './adminReducer';
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  payment: paymentReducer,
  referrals: referralReducer,
  admin: adminReducer
});
