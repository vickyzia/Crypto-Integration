Currently the system is running on a test network. 
To switch to main network for MetaMask: 
1. Change ETHEREUM_NETWORK in payment-configs.js to main network. You can get the updated link from
Infura website: https://infura.io/ (This will make sure that META_MASK confirmations are
coming from main network.)
2. Update in client side and set METAMASK_NETWORK_REQUIRED from utils/constants to 1 which
is the id for main network in MetaMask.

To switch CoinPayments to main network:

1. Create your own account and update coinPayments client's key and secret to your own 
account this will make sure that you are receiving funds in your account.
2. Currently we are using CoinPayments test coin LTCT in createCoinPaymentsTransaction 
in routes/payments.js. Update this to payment type when conducting actual transactions.
3. In payment-configs.js we have an IPN_CALLBACK this is the address where the transactions
confirmations are posted. It is handled in payments.js route. Update it to your own server
URL when required (when set to localhost you will not receive confirmation). There is also
a key at the end of URL that is to ensure that we are getting confirmation from a trusted
source. A new key is generated for each transactions and then appended to this URL.
Transactions are only confirmed if the key matches.