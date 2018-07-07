import axios from 'axios';

import {
    TRANSACTION_UPDATE_UI,
    TRANSACTION_UPDATE_CURRENT,
    LOAD_USER_TRANSACTION_LIST,
    TRANSACTION_SENT,
    UPDATE_PAYMENT_AMOUNT,
    LOAD_COMPLETE,
    CONFIRM_TRANSACTION
} from './types';
import {getAccounts} from '../utils/metaMask'

export const loadComplete = (paymentData) => dispatch => {
    if(window.web3){
        let netId = window.web3.version.network != undefined?  Number(window.web3.version.network):-1;
        if(netId != -1 && !paymentData){
            axios
            .get('http://localhost:5000/api/payments/loadPaymentData')
            .then(res => {
                dispatch(loadCompleteActionCreator(netId,res.data,getAccounts()));
            })
            .catch(err =>
                {
                    
                }
            );
        }     
        else{
            dispatch(loadCompleteActionCreator(netId,paymentData,getAccounts()));
        }   
    }
};


export const loadCompleteActionCreator = (netId, paymentData, metamaskAccounts) => {
    return {
        type: LOAD_COMPLETE,
        payload: {
            isLoading:false,
            networkId: netId,
            paymentData: paymentData,
            metamaskAccounts: metamaskAccounts
        }
    };
};
export const updatePayment = (amount) => dispatch => {
    if(!(amount instanceof Number)){
        amount = Number(amount);
    }
    dispatch(updatePaymentActionCreator(amount));
}
export const updatePaymentActionCreator = (amount) =>{
    return{
        type: UPDATE_PAYMENT_AMOUNT,
        payload: {
            paymentAmount: amount
        }
    }
}
export const updateTransactionUI = (isTransacting) => dispatch=> {
    dispatch(transactionUpdateUIActionCreator(isTransacting));
}
export const transactionUpdateUIActionCreator = (isTransacting) =>{
    return{
        type: TRANSACTION_UPDATE_UI,
        payload:{
            isTransactionInProgress: isTransacting
        }
    };
}

export const updateCurrentTransaction = (currentTransaction) => dispatch=> {
    dispatch(transactionCurrentUpdateActionCreator(currentTransaction));
}
export const transactionCurrentUpdateActionCreator = (currentTransaction) =>{
    return{
        type: TRANSACTION_UPDATE_CURRENT,
        payload:{
            currentTransaction: currentTransaction
        }
    };
}

export const sendTransaction = (transactionObject) => dispatch =>{
    axios
    .post('http://localhost:5000/api/payments/createTransaction', transactionObject)
    .then(res => {
        dispatch(loadUserTransactions());
    })
    .catch(err =>
        {
            console.log("transaction error: " + err);
        }
    );
}

export const transactionSentActionCreator = () =>{
    return {
        type: TRANSACTION_SENT
    };
}

export const loadUserTransactions = () => dispatch =>{
    axios
    .get('http://localhost:5000/api/payments/userTransactions')
    .then(res => {
        dispatch(loadUserTransactionsActionCreator(false,false,res.data));
    })
    .catch(err =>
        {
            dispatch(loadUserTransactionsActionCreator(false,true,[])); 
        }
    );
}

export const confirmTransaction = (index, transactionId) => dispatch=> {
    dispatch(confirmTransactionActionCreator(transactionId, true));
    axios
    .post('http://localhost:5000/api/payments/confirmTransaction',{transactionId:transactionId})
    .then(res => {
        dispatch(confirmTransactionActionCreator(transactionId, false));
        dispatch(loadUserTransactions());
    })
    .catch(err =>
        {
            dispatch(confirmTransactionActionCreator(transactionId, false));
        }
    );
}
export const confirmTransactionActionCreator = (transactionId, isUpdating)=> {
    return {
        type : CONFIRM_TRANSACTION,
        payload:{
            transactionId: transactionId,
            isUpdating:isUpdating
        }
    }
}
export const loadUserTransactionsActionCreator = (isFetching=false,errorLoading=false,transactionList) => {
    return {
        type: LOAD_USER_TRANSACTION_LIST,
        payload:{
            userTransactions:{
                isFetching:isFetching,
                transactionList:transactionList,
                errorLoading:errorLoading
            }
        }
    };
}

