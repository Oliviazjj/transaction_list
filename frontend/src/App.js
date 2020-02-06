// App.js
import React, { Component, Fragment } from 'react';
import axios from "axios";
import Header from "./components/Header";
import Home from "./components/Home";

import { Provider } from 'react-redux';
import store from './store'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <Header />
          <Home />
        </Fragment>
      </Provider>
    );
  }
}

export default App;