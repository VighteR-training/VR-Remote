import React from 'react';
import axios from 'axios';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {View, Text, ImageBackground, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import { Container, Thumbnail, Col, Grid, Header, Button, Content, Label, Form, Item, Input } from 'native-base';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Wallpaper from './Wallpaper';

import {setToken} from '../actions/tokenActions';

import bgSrc from '../assets/change.jpg';

class Login extends React.Component {
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
    console.log(GoogleSigninButton, ' warna')
  }

  _signIn() {
    GoogleSignin.signIn()
      .then((user) => {
        axios.post('https://alanglab-189602.appspot.com/auth', {
          email: user.email,
          name: user.name
        }).then(payload => {
          AsyncStorage.setItem('token', payload.data.token);
          this.props.setToken(payload.data.token);
          this.props.navigation.navigate('MainController');
        }).catch(error => {
          console.log(error);
        });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      });
  }

  render() {
    return (
      <ImageBackground style={styles.picture} source={bgSrc}>
        <Container>
          <Content>
            <View style={styles.centered}>
              <TouchableOpacity>
                <GoogleSigninButton 
                  title='Login'
                  style={styles.Gsign} 
                  color={GoogleSigninButton.Color.Auto}
                  onPress={this._signIn.bind(this)}
                />
              </TouchableOpacity>
            </View>
          </Content>
        </Container>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
  },
  centered: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginTop: 370
  },
  Gsign: {
    width: 250,
    height: 40,
  }
})

const mapStateToProps = state => {
  return {
    token: state.tokenReducer
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setToken
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)