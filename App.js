import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';

import Login from './src/components/Login';
import MainController from './src/components/MainController';
import Logs from './src/components/Logs';

import { StackNavigator, TabNavigator } from 'react-navigation';

import store from './src/store/index';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      token: null
    }
  }

  _getToken = (callback) => {
    AsyncStorage.getItem('token', (err, val) => {
      callback(val)
    })
  }

  componentDidMount() {
    this._getToken(token => {
      this.setState({
        token: token
      });
    });
  }

  render() {
    return (
      <Provider store = {store}>
        <Drawer/>
      </Provider>)
    }
  }

const TabNav = TabNavigator({
  MainController: {
    screen: MainController
  },
  Logs: {
    screen: Logs
  }
}, {
  tabBarPosition: 'bottom'
});

const Drawer = StackNavigator({
  Login: {
    screen: Login
  },
  Main: {
    screen: TabNav
  }
}, {
  initialRouteName: 'Login',
  navigationOptions : {
    headerStyle: {
    backgroundColor : '#424242'
    },
    headerTintColor : '#fff',
    headerTitleStyle : {
      fontWeight: 'bold',
      color: '#fff',
    },
  }
},
)