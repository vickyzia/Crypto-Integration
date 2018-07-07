import {BigNumber} from 'bignumber.js'
var Web3 = require('web3');
export const getAccounts = () =>{
    if(window.web3)
        return window.web3.eth.accounts;
    return null;
}
export const getNetworkId = () =>{
    if(window.web3){
        return window.web3.version.getNetowrkId;
    }
    return -1;
}

export const isWeb3Available = () =>{
    if(window.web3)
        return true;
    return false;
}
export const createTransaction = ({fromAddress, toAddress, amount}, callback) =>{
    if(window.web3){
        var web3js = new Web3(window.web3.currentProvider);
        web3js.eth.getGasPrice((error,result)=>{
            if(error)
                return false;
            let gasPrice = new Number(result);
            window.web3.eth.sendTransaction({
                from: fromAddress,
                to:toAddress,
                value: window.web3.toWei(amount,'ether'),
                gasPrice: gasPrice.toString()
            },callback);
        })

        return true;
    }
    return false;
}