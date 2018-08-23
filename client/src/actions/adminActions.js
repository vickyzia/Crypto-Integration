import axios from 'axios';
import {BASE_URL} from '../utils/constants';
import {
    ADMIN_LOAD_PAYOUTS,
    ADMIN_IS_PAYOUT_LOADING,
    ADMIN_LOAD_UNPROCESSED_TRANSACTIONS,
    ADMIN_IS_TRANSACTIONS_LOADNG,
    ADMIN_AUTHORIZATION,
    ADMIN_PROCESS_TRANSACTION,
    ADMIN_USERS_IS_LOADING,
    ADMIN_LOAD_USERS,
    ADMIN_UPDATE_USER,
    ADMIN_CURRENT_TRANSACTION_UPDATE,
    ADMIN_LOAD_BLOCKCHAIN_TRANSACTIONS,
    ADMIN_IS_BLOCKCHAIN_TRANSACTIONS_LOADING,
    ADMIN_CONFIRM_TRANSACTION
} from './types';

export const loadUnprocessedTransactions = () => dispatch => {
    dispatch(loadTransactionsIsLoading(true));
    axios
    .get(BASE_URL+'/api/admin/unprocessedTansactions')
    .then(res => {
        console.log(res.data);
        dispatch(loadUnprocessedTransactionsActionCreator(res.data));
        dispatch(loadTransactionsIsLoading(false));
    })
    .catch(err =>
        {
            dispatch(loadTransactionsIsLoading(false));
            dispatch(loadUnprocessedTransactionsActionCreator([]));
        }
    );
};

export const loadUnprocessedTransactionsActionCreator = (unprocessedTransactions) => {
    return {
        type: ADMIN_LOAD_UNPROCESSED_TRANSACTIONS,
        payload: {
            unprocessedTransactions: unprocessedTransactions
        }
    };
};
export const loadTransactionsIsLoading = (isLoading) => {
    return {
        type: ADMIN_IS_TRANSACTIONS_LOADNG,
        payload: {
            isLoading: isLoading
        }
    };
};
export const loadAdminPayouts = () => dispatch =>{
    dispatch(payoutDataIsLoadingCreator(true));
    axios
        .get(BASE_URL+'/api/admin/payouts')
        .then(res => {
            console.log(res.data);
            dispatch(loadAdminPayoutsCreator(res.data));
            dispatch(payoutDataIsLoadingCreator(false));
        })
        .catch(err =>
            {
                dispatch(payoutDataIsLoadingCreator(false));
                dispatch(loadAdminPayoutsCreator([]));
            }
        );
};
export const loadAdminPayoutsCreator = (payouts) => {
    return {
        type: ADMIN_LOAD_PAYOUTS,
        payload: {
            payoutList: payouts
        }
    };
};

export const payoutDataIsLoadingCreator = (isLoading) => {
    return {
        type: ADMIN_IS_PAYOUT_LOADING,
        payload: {
            isLoading: isLoading
        }
    };
};

export const authorizationActionCreator = (isAuthorized) => {
    return {
        type: ADMIN_AUTHORIZATION,
        payload: {
            isAuthorized: isAuthorized
        }
    };
};

export const processTransaction = (transaction) => dispatch =>{
    dispatch(processTransactionActionCreator(transaction, true));
    let data={
        paymentId: transaction._id
    };
    axios
        .post(BASE_URL+'/api/admin/processPayment',data)
        .then(res => {
            console.log(res.data);
            dispatch(processTransactionActionCreator(transaction, false));
            dispatch(loadUnprocessedTransactions());
        })
        .catch(err =>
            {
                dispatch(processTransactionActionCreator(transaction, false));
            }
        );

}

export const processTransactionActionCreator = (transaction, isUpdating) => {
    return {
        type: ADMIN_PROCESS_TRANSACTION,
        payload: {
            transaction: transaction,
            isUpdating: isUpdating
        }
    };
};

export const loadUsers = () => dispatch => {
    dispatch(loadUsersIsLoadingActionCreator(true));
    axios
    .get(BASE_URL+'/api/admin/users')
    .then(res => {
        console.log(res.data);
        dispatch(loadUsersActionCreator(res.data));
        dispatch(loadUsersIsLoadingActionCreator(false));
    })
    .catch(err =>
        {
            dispatch(loadUsersIsLoadingActionCreator(false));
            dispatch(loadUsersActionCreator([]));
        }
    );
};

export const loadUsersActionCreator = (users) => {
    return {
        type: ADMIN_LOAD_USERS,
        payload: {
            users: users
        }
    };
};
export const loadUsersIsLoadingActionCreator = (isLoading) => {
    return {
        type: ADMIN_USERS_IS_LOADING,
        payload: {
            isLoading: isLoading
        }
    };
};
export const updateUser = (user )=> dispatch =>{
    dispatch(updateUserActionCreator(user, true));
    let data = {
        userEmail : user.email,
        enable: !user.isEnabled
    };
    axios
    .post(BASE_URL+'/api/admin/updateUserStatus',data)
    .then(res => {
        console.log(res.data);
        dispatch(updateUserActionCreator(user, false));
        dispatch(loadUsers());
    })
    .catch(err =>
        {
            console.log(err);
            dispatch(updateUserActionCreator(user, false));
        }
    );
}
export const updateUserActionCreator = (user, isUpdating) => {
    return{
        type:ADMIN_UPDATE_USER,
        payload: {
            user: user,
            isUpdating: isUpdating
        }
    }
}

export const createBlockchainTransactionOnAPI = (currentTransaction) => dispatch => {
    axios
    .post(BASE_URL+'/api/admin/createTransaction',currentTransaction)
    .then(res => {
        console.log(res.data);
        dispatch(loadUsers());
    })
    .catch(err =>
        {
            console.log(err);
        }
    );
} 

export const loadBlockchainTransactions = () => dispatch =>{
    dispatch(blockChainIsLoadingActionCreator(true));
    axios
    .get(BASE_URL+'/api/admin/blockchainTransactions')
    .then(res => {
        console.log(res.data);
        dispatch(loadBlockchainTransactionsActionCreator(res.data));
        dispatch(blockChainIsLoadingActionCreator(false));
    })
    .catch(err =>
        {
            console.log(err);
            dispatch(blockChainIsLoadingActionCreator(false));
        }
    );
}
export const loadBlockchainTransactionsActionCreator = (transactionList)  =>{
    return {
        type: ADMIN_LOAD_BLOCKCHAIN_TRANSACTIONS,
        payload:{
            transactionList: transactionList
        }
    }
}

export const blockChainIsLoadingActionCreator = (isLoading)  =>{
    return {
        type: ADMIN_IS_BLOCKCHAIN_TRANSACTIONS_LOADING,
        payload:{
            isLoading: isLoading
        }
    }
}

export const confirmTransaction = (transactionId) => dispatch=> {
    dispatch(confirmTransactionActionCreator(transactionId, true));
    axios
    .post(BASE_URL+'/api/admin/confirmTransaction',{transactionId:transactionId})
    .then(res => {
        dispatch(confirmTransactionActionCreator(transactionId, false));
        dispatch(loadBlockchainTransactions());
    })
    .catch(err =>
        {
            dispatch(confirmTransactionActionCreator(transactionId, false));
        }
    );
}
export const confirmTransactionActionCreator = (transactionId, isUpdating)=> {
    return {
        type : ADMIN_CONFIRM_TRANSACTION,
        payload:{
            transactionId: transactionId,
            isUpdating:isUpdating
        }
    }
}