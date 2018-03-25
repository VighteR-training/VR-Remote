import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';

import Login from './src/components/Login';
import MainController from './src/components/MainController'; 

import { DrawerNavigator } from 'react-navigation';

import store from './src/store/index';

export default class App extends React.Component {
  render() {
    return (
      <Provider store = {store}>
        <Drawer/>
      </Provider>
    );
  }
}

const Drawer = DrawerNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      tabBarLabel : "Login"
    }
  },
  MainController: {
    screen: MainController
  }
}, {initialRouteName: 'Login'})
