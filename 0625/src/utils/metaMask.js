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