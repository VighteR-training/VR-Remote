import React from 'react';
import axios from 'axios';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {ActivityIndicator, View, Text, ImageBackground, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import { Container, Thumbnail, Col, Grid, Header, Button, Content, Label, Form, Item, Input } from 'native-base';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setToken} from '../actions/tokenActions';

import bgSrc from '../assets/wallpaper.png';

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }

  static navigationOptions = {
    title: 'Login',
    header: null
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
    this.setState({
      loading: true
    })
    GoogleSignin.signIn()
      .then((user) => {
        axios.post('https://alanglab-189602.appspot.com/auth', {
          email: user.email,
          name: user.name
        }).then(payload => {
          AsyncStorage.setItem('token', payload.data.token);
          this.props.setToken(payload.data.token);
          this.setState({
            loading: false
          })
          this.props.navigation.navigate('MainController', {name: user.name, email: user.email});
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
           <View style={styles.centered}>
              {
                this.state.loading ? (
                  <View>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{color: '#fff'}}>Loading...</Text>
                  </View>
                ) : (
                <TouchableOpacity>
                  <GoogleSigninButton 
                    title='Login'
                    style={styles.Gsign} 
                    color={GoogleSigninButton.Color.Auto}
                    onPress={this._signIn.bind(this)}
                  />
                </TouchableOpacity>
                )
              }
            </View>
          </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  centered: {
    alignItems: 'center',
  },
  Gsign: {
    width: 120,
    height: 50
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