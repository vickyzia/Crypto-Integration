export default {
  items: [
    {
      title: true,
      name: 'Welcome!',
      wrapper: {
        element: '',
        attributes: {},
      },
      class: 'bit_sidebar_category'
    },
    {
      name: 'Payment',
      url: '/dashboard/Payment',
      icon: 'icon-hourglass',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Dashboard',
      url: '/dashboard/Account/AccountSummary',
      icon: 'icon-list',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Referral Network',
      url: '/dashboard/Other/Referrals',
      icon: 'icon-user-follow',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Settings',
      url: '/dashboard/Account/AccountSettings',
      icon: 'icon-settings',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Admin Only Page',
      url: '/dashboard/AdminOnly',
      icon: 'icon-star',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Admin Payouts',
      url: '/dashboard/AdminOnly/AdminPayouts',
      icon: 'icon-star',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Process Transactions',
      url: '/dashboard/AdminOnly/ProcessTransactions',
      icon: 'icon-star',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Blockchain Manager',
      url: '/dashboard/AdminOnly/BlockchainManager',
      icon: 'icon-star',
      class: 'bit_sidebar_menuitems',
    },
    {
      name: 'Blockchain Transactions',
      url: '/dashboard/AdminOnly/BlockchainTransactions',
      icon: 'icon-star',
      class: 'bit_sidebar_menuitems',
    }

  ],
};
