import {
    SET_CURRENT_USER, UPDATE_REG_EMAIL
} from '../actions/types';
import isEmpty from '../validations/is-empty';

const initialState = {
    isAuthenticated: false,
    user: {},
    regEmail: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case UPDATE_REG_EMAIL:
            return {
                ...state,
                regEmail: action.payload
            }
        default:
            return state;
    }
}