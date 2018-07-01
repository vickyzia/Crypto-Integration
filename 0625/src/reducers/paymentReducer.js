import {
    GET_WALLETS_FOR_PAYMENT,
    LOAD_COMPLETE
} from '../actions/types';

const initialState = {
    isLoading: true,
    networkId: -1,
    paymentData: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_COMPLETE:
            return {
                ...state,
                isLoading: false,
                networkId: action.payload.networkId,
                paymentData: action.payload.paymentData
            };
        default:
            return state;
    }
}