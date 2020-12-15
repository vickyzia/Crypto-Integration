import React from 'react';
import ReactDOM from 'react-dom';
import Referrals from './Referrals';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Referrals />, div);
  ReactDOM.unmountComponentAtNode(div);
});