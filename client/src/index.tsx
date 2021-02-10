import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { AnyAction, applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { THEME } from 'assets/Theme';
import App from 'components/App/App';
import CombinedReducer from 'redux/CombinedReducer';
import { Socket } from 'lib/Socket';
import './index.css';

const loggerMiddleware = createLogger({
  collapsed: () => {
    return true;
  },
  predicate: (getState: Function, action: AnyAction) => {
    const type = action.type.toLowerCase();
    return !type.includes('toggle') && !type.includes('initialized');
  },
  duration: false,
  timestamp: false,
  diff: true,
});

const store = createStore(CombinedReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
Socket.createInstance(store);

ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root'),
);
