import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import mapReducer from './store/reducers/map';
import filtersReducer from './store/reducers/filters';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootReducer = combineReducers({filters:filtersReducer, map:mapReducer})
const store = createStore(rootReducer);

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
