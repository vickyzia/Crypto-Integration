import axios from 'axios';

import {
    GET_WALLETS_FOR_PAYMENT,
    LOAD_COMPLETE
} from './types';

export const loadComplete = (paymentData) => dispatch => {
    if(window.web3){
        let netId = window.web3.version.network != undefined?  Number(window.web3.version.network):-1;
        if(netId != -1 && !paymentData){
            axios
            .get('http://localhost:5000/api/payments/loadPaymentData')
            .then(res => {
                dispatch(loadCompleteActionCreator(netId,res.data));
            })
            .catch(err =>
                {
                    
                }
            );
        }     
        else{
            dispatch(loadCompleteActionCreator(netId,paymentData));
        }   
    }
};


export const loadCompleteActionCreator = (netId, paymentData) => {
    return {
        type: LOAD_COMPLETE,
        payload: {
            isLoading:false,
            networkId: netId,
            paymentData: paymentData
        }
    };
};

