import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ImageCategorizationApp from './ImageCategorizationApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ImageCategorizationApp />, document.getElementById('root'));
registerServiceWorker();
