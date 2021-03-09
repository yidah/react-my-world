import { createStore } from 'redux';
import { Provider } from 'react-redux';
import map from './store/reducers/map';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const store = createStore(map);

// const app = (
//   <React.StrictMode>
//     <Provider store={store}><App /></Provider>
//   </React.StrictMode>
// )

// ReactDOM.render(app,document.getElementById('root'));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
