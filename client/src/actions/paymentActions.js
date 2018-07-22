import axios from 'axios';
import {BASE_URL} from '../utils/constants';
import {
    TRANSACTION_UPDATE_UI,
    TRANSACTION_UPDATE_CURRENT,
    LOAD_USER_TRANSACTION_LIST,
    TRANSACTION_SENT,
    UPDATE_PAYMENT_AMOUNT,
    LOAD_COMPLETE,
    CONFIRM_TRANSACTION,
    CHANGE_COIN_TYPE,
    CREATE_CP_PAYMENT_TRANSACTION,
    CP_PAYMENT_TRANSACTION_STATUS,
    OPEN_NEW_WINDOW,
    CP_PAYMENT_LINK_UPDATE,
    GET_USER_PAYMENT_DATA
} from './types';
import {getAccounts} from '../utils/metaMask'

export const loadComplete = (paymentData) => dispatch => {
    if(window.web3){
        let netId = window.web3.version.network != undefined?  Number(window.web3.version.network):-1;
        if(netId != -1 && !paymentData){
            axios
            .get(BASE_URL+'/api/payments/loadPaymentData')
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
    .post(BASE_URL+'/api/payments/createTransaction', transactionObject)
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
    .get(BASE_URL+'/api/payments/userTransactions')
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
    .post(BASE_URL+'/api/payments/confirmTransaction',{transactionId:transactionId})
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

export const changeCoinType = (coinType) => dispatch => {
    dispatch(changeCoinTypeActionCreator(coinType));
}
export const changeCoinTypeActionCreator = (coinType) => {
    return {
        type: CHANGE_COIN_TYPE,
        payload:{
            coinType: coinType
        }
    };
}
export const createCPTransaction = (transactionObject) => dispatch =>{
    dispatch(createCPTransactionActionCreator(true));
    axios
    .post(BASE_URL+'/api/payments/createCoinPaymentsTransaction', transactionObject)
    .then(res => {
        dispatch(CPPaymentLinkUpdate(res.data.statusUrl))
        dispatch(createCPTransactionActionCreator(false));
        dispatch(CPTransactionStatusActionCreator(1));
        dispatch(loadUserTransactions());
    })
    .catch(err =>
        {
            dispatch(createCPTransactionActionCreator(false));
            dispatch(CPTransactionStatusActionCreator(2));
            console.log("transaction error: " + err);
        }
    );
}

export const createCPTransactionActionCreator = (isCPTransactionInProgress) =>{
    return{
        type: CREATE_CP_PAYMENT_TRANSACTION,
        payload:{
            isCPTransactionInProgress: isCPTransactionInProgress
        }
    }
}
export const CPTransactionStatusActionCreator = (CPTransactionStatus) =>{
    return{
        type: CP_PAYMENT_TRANSACTION_STATUS,
        payload:{
            CPTransactionStatus: CPTransactionStatus
        }
    }
}
export const CPPaymentLinkUpdate = (link) => {
    return{
            type: CP_PAYMENT_LINK_UPDATE,
            payload:{
                CPLastPaymentLink: link
            }
        }
}
export const getUserPaymentData= ()=> dispatch =>{
    axios
    .get(BASE_URL+'/api/payments/loadUserPaymentInfo')
    .then(res => {
        console.log(res);
        dispatch(getUserPaymentDataCreator(res.data));
    })
    .catch(err =>
        {
            console.log(err);
        }
    );
}
export const getUserPaymentDataCreator = (tokens)=>{
    return {
        type: GET_USER_PAYMENT_DATA,
        payload: {
            userTokens: tokens
        }
    }
}
