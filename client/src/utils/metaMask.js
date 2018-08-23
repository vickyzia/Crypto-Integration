import {BigNumber} from 'bignumber.js'
import {HFT_ADDRESS} from '../utils/constants';
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
        });

        return true;
    }
    return false;
}
export const createHFTTransaction = ({toAddress, tokens}, callback) =>{
    if(window.web3){
        var web3js = new Web3(window.web3.currentProvider);
        let contract = web3js.eth.contract(getHFTABI()).at(HFT_ADDRESS);
        let decimals = web3js.toBigNumber(18);
        let amount = web3js.toBigNumber(tokens);
        console.log(contract);
        let value = amount.times(web3js.toBigNumber(10).pow(decimals));
        // call transfer function
        web3js.eth.defaultAccount=web3js.eth.accounts[0];
        web3js.eth.getGasPrice((error,result)=>{
            if(error)
                return false;
            let gasPrice = new Number(result);
            contract.transfer(toAddress, value,{gasPrice:gasPrice, gas:210000}, callback);
        });
    }
}
export const getHFTABI = ()=>{
    return JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]');
}