import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const ICO = Loadable({
  loader: () => import('./views/ICO'),
  loading: Loading,
});

const AccountSummary = Loadable({
  loader: () => import('./views/Account/AccountSummary'),
  loading: Loading,
});

const ActivityHistory = Loadable({
  loader: () => import('./views/Account/ActivityHistory'),
  loading: Loading,
});

const AccountSettings = Loadable({
  loader: () => import('./views/Account/AccountSettings'),
  loading: Loading,
});

const Referrals = Loadable({
  loader: () => import('./views/Other/Referrals'),
  loading: Loading,
});


const AdminOnly = Loadable({
  loader: () => import('./views/AdminOnly'),
  loading: Loading,
});

const AdminPayouts = Loadable({
  loader: () => import('./views/AdminOnly/AdminPayout/admin-payout'),
  loading: Loading,
});

const ProcessTransactions = Loadable({
  loader: () => import('./views/AdminOnly/ProcessPayment/PaymentList'),
  loading: Loading,
});

const BlockchainPaymentManager = Loadable({
  loader: () => import('./views/AdminOnly/users/BlockchainPaymentManager'),
  loading: Loading,
});

const BlockchainTransactions = Loadable({
  loader: () => import('./views/AdminOnly/BlockchainTransactionList/blockchainTransactionList'),
  loading: Loading,
});




// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/dashboard', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard/Payment', name: 'Initial Coin Offering', component: ICO },
  { path: '/dashboard/Account/AccountSummary', name: 'User Dashboard', component: AccountSummary },
  { path: '/dashboard/Account/AccountSettings', name: 'Account Settings', component: AccountSettings },
  { path: '/dashboard/Other/Referrals', name: 'Referral Network', component: Referrals },
  { path: '/dashboard/AdminOnly/AdminPayouts', name: 'Admin Payouts', component: AdminPayouts},
  { path: '/dashboard/AdminOnly/ProcessTransactions', name: 'Process Transactions', component: ProcessTransactions},
  { path: '/dashboard/AdminOnly/BlockchainManager', name: 'Blockchain Manager', component: BlockchainPaymentManager},
  { path: '/dashboard/AdminOnly/BlockchainTransactions', name: 'Blockchain Transactions', component:BlockchainTransactions},
  { path: '/dashboard/AdminOnly', name: 'Admin Only Page', component: AdminOnly },
];

export default routes;
