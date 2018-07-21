import React from 'react';

const AccountUnavailable = () => (
  <div className="Web3Provider-container">
      <h4
        className="Web3Provider-title text-shadow-simple flex_row flex_justified bit_red"
        dangerouslySetInnerHTML={{ __html: 'Please sign in MetaMask and select an account!' }}
      />
    </div>
);

export { AccountUnavailable };