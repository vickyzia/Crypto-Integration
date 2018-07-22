const axios = require('axios');
var coinTypes = require('./coin-types')
var Coinpayments = require('coinpayments');
var coinPaymentsClient = new Coinpayments({
    key: '94850cce3d7bbd018077ecf3b8c89315c90836710f1ed4a16f64d1181567380d',
    secret: 'f73f21154c9f00A19DF62C3EA63d1f834aD42afa5c46DeB25f858Cf4F1576Fd9'
  }); 

const CONVERSION_URL = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=ETH";
module.exports = {
    getETHTokenValue(){
            return 4000;
    },
    async getBTCTokenValue(){

        return new Promise((resolve,reject)=>{
                coinPaymentsClient.rates({short:1}, function(err,result){
                let BtcTokenValue = 0;
                if(err){
                    axios
                    .get(CONVERSION_URL)
                    .then(res => {
                        resolve( res.data.BTC.ETH *4000);
                    })
                    .catch(err =>
                    {
                         resolve(BtcTokenValue); 
                    });
                }
                else{
                    BtcTokenValue = (1/result.ETH.rate_btc) * 4000;
                    resolve(BtcTokenValue);
                }
            });
        });
    },
    getBonusTokens(ether){
        let bonus = 0;
        if(ether >= 5){
            bonus= ether * 0.50;
          }
          else if(ether >= 3){
            bonus = ether * 0.30;
          }
          else if(ether >= 2){
            bonus= ether * 0.20;
          }
          else if(ether >= 1){
            bonus= ether * 0.10;
          }  
          return bonus * this.getETHTokenValue();
    }
};