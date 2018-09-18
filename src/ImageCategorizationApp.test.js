import React from 'react';
import ReactDOM from 'react-dom';
import App from './ImageCategorizationApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImageCategorizationApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
