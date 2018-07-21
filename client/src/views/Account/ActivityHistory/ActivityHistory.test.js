import React from 'react';
import ReactDOM from 'react-dom';
import ActivityHistory from './ActivityHistory';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ActivityHistory />, div);
  ReactDOM.unmountComponentAtNode(div);
});