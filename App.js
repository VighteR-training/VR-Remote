import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';

import Login from './src/components/Login';
import MainController from './src/components/MainController'; 

import store from './src/store/index';

export default class App extends React.Component {
  render() {
    return (
      <Provider store = {store}>
        <MainController/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
