import React from 'react';
import axios from 'axios';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {ActivityIndicator, View, Text, ImageBackground, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native';
import { Container, Thumbnail, Col, Grid, Header, Button, Content, Label, Form, Item, Input } from 'native-base';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Wallpaper from './Wallpaper';

import {setToken} from '../actions/tokenActions';

import bgSrc from '../assets/change.jpg';

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }

  static navigationOptions = {
    title: 'Login',
    headerMode: 'none',
    headerLeft: null
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
          </Content>
        </Container>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1
  },
  centered: {
    marginTop: 220,
    alignItems: 'center'
  },
  Gsign: {
    width: 150,
    height: 60
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