import React from 'react';
import ReactDOM from 'react-dom';
import AccountSummary from './AccountSummary';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AccountSummary />, div);
  ReactDOM.unmountComponentAtNode(div);
});