import React from 'react';
import axios from 'axios';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import { Container, Thumbnail, Col, Grid, Header, Button, Content, Label, Form, Item, Input } from 'native-base';

export default class Login extends React.Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
    GoogleSignin.hasPlayServices({
      autoResolve: true
    })
    GoogleSignin.configure({
      webClientId: '1076077368750-b9shjuououruah5dluu4b82ttjlubml3.apps.googleusercontent.com'
    })
  }

  _signIn() {
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user.email);
        axios.post('http://35.187.249.39:8000/auth', {
          email: user.email,
          name: user.name
        }).then(payload => {
          AsyncStorage.setItem('token', payload.data.token);
        }).catch(error => {
          console.log(error);
        });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <GoogleSigninButton 
        title='Login'
        style={{width: 48, height: 48}} 
        size={GoogleSigninButton.Size.Icon} 
        color={GoogleSigninButton.Color.Dark}
        onPress={this._signIn.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});