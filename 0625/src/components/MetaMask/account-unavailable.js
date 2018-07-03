import React from 'react';

const AccountUnavailable = () => (
  <div className="Web3Provider-container">
      <h2
        className="Web3Provider-title text-shadow-simple flex_row flex_justified"
        dangerouslySetInnerHTML={{ __html: 'No ETH Account Available' }}
      />
      <div className="flex_row flex_justified">
        <p className="contribute_center"
          dangerouslySetInnerHTML={{ __html: `It seems that you don&apos;t have an ETH account selected in MetaMask.` }}
        />
        </div>
    </div>
);

export { AccountUnavailable };