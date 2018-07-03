import {
    TRANSACTION_UPDATE_UI,
    TRANSACTION_SENT,
    LOAD_USER_TRANSACTION_LIST,
    TRANSACTION_UPDATE_CURRENT,
    UPDATE_PAYMENT_AMOUNT,
    LOAD_COMPLETE
} from '../actions/types';

const initialState = {
    isLoading: true,
    networkId: -1,
    paymentData: null,
    metamaskAccounts: null,
    paymentAmount: 0,
    currentTransaction: null,
    isTransactionInProgress: false,
    userTransactions: {
        isFetching:false,
        errorLoading:false,
        transactionList:[]
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_COMPLETE:
            return {
                ...state,
                isLoading: false,
                networkId: action.payload.networkId,
                paymentData: action.payload.paymentData,
                metamaskAccounts: action.payload.metamaskAccounts
            };
        case UPDATE_PAYMENT_AMOUNT:
            return {
                ...state,
                paymentAmount: action.payload.paymentAmount
            }
        case TRANSACTION_UPDATE_UI:
            return{
                ...state,
                isTransactionInProgress: action.payload.isTransactionInProgress
            }
        case TRANSACTION_UPDATE_CURRENT:
            return{
                ...state,
                currentTransaction: action.payload.currentTransaction
            }
        case LOAD_USER_TRANSACTION_LIST:
            return{
                ...state,
                userTransactions:action.payload.userTransactions
            }
        case TRANSACTION_SENT:
            return state;
        default:
            return state;
    }
}