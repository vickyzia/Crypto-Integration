import {
    ADMIN_LOAD_PAYOUTS,
    ADMIN_IS_PAYOUT_LOADING,
    ADMIN_IS_TRANSACTIONS_LOADNG,
    ADMIN_LOAD_UNPROCESSED_TRANSACTIONS,
    ADMIN_AUTHORIZATION,
    ADMIN_PROCESS_TRANSACTION,
    ADMIN_USERS_IS_LOADING,
    ADMIN_LOAD_USERS,
    ADMIN_UPDATE_USER,
    ADMIN_LOAD_BLOCKCHAIN_TRANSACTIONS,
    ADMIN_IS_BLOCKCHAIN_TRANSACTIONS_LOADING,
    ADMIN_CONFIRM_TRANSACTION
} from '../actions/types';

const initialState = {
    isPayoutLoading: false,
    payoutList: [],
    unprocessedTransactions: [],
    isUnprocessedTransactionsLoading: false,
    isAuthorized: true,
    users: [],
    isLoadingUsers: false,
    blockchainTransactionList: [],
    isLoadingBlockchainTransactions : false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADMIN_LOAD_PAYOUTS:
            return {
                ...state,
                payoutList: action.payload.payoutList
            };
        case ADMIN_IS_PAYOUT_LOADING:
            return {
                ...state,
                isPayoutLoading: action.payload.isLoading
            }
        case ADMIN_LOAD_UNPROCESSED_TRANSACTIONS:
            return {
                ...state,
                unprocessedTransactions: action.payload.unprocessedTransactions
            }
        case ADMIN_IS_TRANSACTIONS_LOADNG:
            return {
                ...state,
                isUnprocessedTransactionsLoading: action.payload.isLoading
            }
        case ADMIN_AUTHORIZATION:
            return {
                ...state,
                isAuthorized: action.payload.isAuthorized
            }
        case ADMIN_PROCESS_TRANSACTION:
            return{
                ...state,
                unprocessedTransactions:state.unprocessedTransactions.map(
                        transaction => transaction._id.toString() == action.payload.transaction._id.toString()?
                            {...transaction,isUpdating:action.payload.isUpdating}:transaction )
                
            }
        case ADMIN_USERS_IS_LOADING:
            return {
                ...state,
                isLoadingUsers : action.payload.isLoading
            }
        case ADMIN_LOAD_USERS:
            return {
                ...state,
                users: action.payload.users
            }
        case ADMIN_UPDATE_USER:
            return {
                ...state,
                users: state.users.map(
                    user => user._id.toString() == action.payload.user._id.toString()?
                        {...user,isUpdatng:action.payload.isUpdating}:user)
            }
        case ADMIN_LOAD_BLOCKCHAIN_TRANSACTIONS:
            console.log(action.payload.transactionList);
            return {
                ...state,
                blockchainTransactionList: action.payload.transactionList
            }
        case ADMIN_IS_BLOCKCHAIN_TRANSACTIONS_LOADING:
            return {
                ...state,
                isLoadingBlockchainTransactions: action.payload.isLoading
            }
        case ADMIN_CONFIRM_TRANSACTION:
            return{
                ...state,
                blockchainTransactionList:state.blockchainTransactionList.map(
                    transaction => transaction.transactionId == action.payload.transactionId?
                        {...transaction,isUpdating:action.payload.isUpdating}:transaction )
            }
        default:
            return state;
    }
}