import React from 'react';
import ReactDOM from 'react-dom';
import Root from './layout/Root';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import './semantic/dist/semantic.min.css';
import './style.css';
import * as firebase from 'firebase';

var config = {
  apiKey: process.env.firebase_api_key,
  authDomain: 'dream-gallery-cf32a.firebaseapp.com',
  databaseURL: 'https://dream-gallery-cf32a.firebaseio.com',
  projectId: 'dream-gallery-cf32a',
  storageBucket: 'dream-gallery-cf32a.appspot.com',
  messagingSenderId: '1015813923361'
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router>
    <Root />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
