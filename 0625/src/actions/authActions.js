import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {
    SET_CURRENT_USER, GET_ERRORS
} from './types';
import {BASE_URL} from '../utils/constants';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post(BASE_URL+'/api/users/register', userData)
        .then(res => history.push('/after-register'))
        .catch(err =>
            {
                console.log("error in register");
                console.log(err);
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            }
        );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
    axios
        .post(BASE_URL+'/api/users/login', userData)
        .then(res => {
            // Save to localStorage
            const {
                token
            } = res.data;
            // Set token to ls
            localStorage.setItem('jwtToken', token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            {
                console.log("error in register");
                console.log(err.response.data);
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            }
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};