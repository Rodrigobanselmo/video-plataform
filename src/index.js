import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage';
import { Provider } from 'react-redux';
import Reducers from './Reducers.js';
import { App } from './App';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['modules','progress'] // which reducer want to store
};

const pReducer = persistReducer(persistConfig, Reducers);

const store = createStore(pReducer);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
