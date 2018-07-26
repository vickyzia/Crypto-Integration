import {
    TRANSACTION_UPDATE_UI,
    TRANSACTION_SENT,
    LOAD_USER_TRANSACTION_LIST,
    TRANSACTION_UPDATE_CURRENT,
    UPDATE_PAYMENT_AMOUNT,
    LOAD_COMPLETE,
    CONFIRM_TRANSACTION,
    CHANGE_COIN_TYPE,
    CP_PAYMENT_TRANSACTION_STATUS,
    CREATE_CP_PAYMENT_TRANSACTION,
    CP_PAYMENT_LINK_UPDATE,
    GET_USER_PAYMENT_DATA
} from '../actions/types';
import {ETH,BTC} from '../utils/constants'
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
    },
    coinType:ETH,
    isCPTransactionInProgress: false,
    CPTransactionStatus :0,
    CPLastPaymentLink: "",
    userTokens: "-",
    payoutHistory: []
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
        case CONFIRM_TRANSACTION:
            return{
                ...state,
                userTransactions:{
                    ...state.userTransactions,
                    transactionList: state.userTransactions.transactionList.map(
                        transaction => transaction.transactionId == action.payload.transactionId?
                            {...transaction,isUpdating:action.payload.isUpdating}:transaction )
                }
            }
        case CHANGE_COIN_TYPE:
            return{
                ...state,
                coinType: action.payload.coinType
        }
        case CREATE_CP_PAYMENT_TRANSACTION:
            return{
                ...state,
                isCPTransactionInProgress: action.payload.isCPTransactionInProgress
        }
        case CP_PAYMENT_TRANSACTION_STATUS:
            return{
                ...state,
                CPTransactionStatus: action.payload.CPTransactionStatus
        }
        case CP_PAYMENT_LINK_UPDATE:
            return {
                ...state,
                CPLastPaymentLink: action.payload.CPLastPaymentLink
            }
        case GET_USER_PAYMENT_DATA:{
            return{
                ...state,
                userTokens: action.payload.userTokens,
                payoutHistory: action.payload.payoutHistory
            }
        }
        case TRANSACTION_SENT:
            return state;
        default:
            return state;
    }
}