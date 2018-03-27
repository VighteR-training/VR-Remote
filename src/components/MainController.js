import React, { Component } from 'react';
import { Container, Content, Thumbnail, Card, CardItem, Header, Left, Body, Right, Title, Text, ListItem, List } from 'native-base';
import {View, AsyncStorage, BackHandler} from 'react-native';
import RNSensors from 'react-native-sensors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

import db from '../config/firebase';
import { assignGyroscope, assignGyroscopeArray, resetGyroscopeArray } from '../actions/gyroscopeActions';
import Platform from '../helpers/dimensions';
import {setToken} from '../actions/tokenActions';

const { Gyroscope } = RNSensors;
const gyroscopeObservable = new Gyroscope({
  updateInterval: 100
});

class MainController extends Component {
  constructor(props){
    super(props);
    this.state = {
      chosen: null,
      magnitude: 0,
      orientation: {
        isPortrait: false,
        isLandscape: false,
        isPhone: false,
        isTablet: false
      },
      isTrue: true
    }

    BackHandler.addEventListener('hahaha', function () {
      GoogleSignin.signOut()
      .then(() => {
        console.log('out');
      })
      .catch((err) => {
        console.log(err)
      });
    });
  }

  static navigationOptions = {
    title: 'Remote',
    headerTitleStyle : {
      width: '100%',
      textAlign: 'center'
    },
    headerLeft: null
  }

  _getToken = (callback) => {
    AsyncStorage.getItem('token', (err, val) => {
      callback(val)
    })
  }

  componentWillMount() {
    GoogleSignin.hasPlayServices({
      autoResolve: true
    })
    GoogleSignin.configure({
      webClientId: '1076077368750-b9shjuououruah5dluu4b82ttjlubml3.apps.googleusercontent.com'
    })

    gyroscopeObservable.subscribe(gyroscope => {
      this.setState({
        orientation: {
        isPortrait : Platform.isPortrait(),
        isLandscape : Platform.isLandscape(),
        isPhone : Platform.isPhone(),
        isTablet : Platform.isTablet(),
        }
      })
      const {x, y, z} = gyroscope;
      if (z > 1) {
          this.props.assignGyroscopeArray(gyroscope);
          this.props.assignGyroscope(gyroscope);
          const maxZ = Math.max.apply(Math,this.props.gyroscopeArray.map(item => item.z));
          const showing = this.props.gyroscopeArray.filter(item => {
            return item.z === maxZ 
          });

          let magnitude = 0; 
          
          if(showing.length > 0){
            magnitude = Math.sqrt((showing[0].z * showing[0].z) + (showing[0].y * showing[0].y) + (showing[0].x * showing[0].x)); 
          }

          this.setState({
            magnitude,
            chosen: showing[0]
          })
          this.getSignal();
      }
    });
  }

  componentWillUnmount() {
    gyroscopeObservable.stop();
  }

  saveHistoryIntoFirebase(obj) {
    db.ref(this.props.navigation.state.params.email.split('@')[0] ?
    (this.props.navigation.state.params.email.split('@')[0]).split('.')[0]
     : this.props.navigation.state.params.email.split('@')[0]).set({...obj, ready: false})
    .then(() => {
      this.props.resetGyroscopeArray();
    })
    .catch(err => {
      console.log(err);
    });
  }

  getSignal(callback){
    db.ref(this.props.navigation.state.params.email.split('@')[0] ?
    (this.props.navigation.state.params.email.split('@')[0]).split('.')[0]
     : this.props.navigation.state.params.email.split('@')[0]).on('value', (snapshot) => {
      let data = snapshot.val()
      if(data.ready){
        this.setState({magnitude: 0})
        if(data.type === 'jab' || data.type === 'uppercut'){
          (this.state.orientation.isPortrait && this.state.orientation.isTablet) ? 
            this.setState({isTrue: true}) : this.setState({isTrue:false});
        }

        if (data.type === 'hook') {
          (this.state.orientation.isLandscape && this.state.orientation.isTablet) ? 
          this.setState({isTrue: true}) : this.setState({isTrue:false});
        }
        setTimeout(()=>{
          this.saveHistoryIntoFirebase({power: this.state.magnitude, gyroscope: this.state.chosen, type: data.type, isTrue: this.state.isTrue})
          console.log(this.props.gyroscopeArray);
        }, 2000)
      }
    })
  }

  render() {
    return (
          <View style={{ flex:1, justifyContent:'center', alignItems: 'center', padding: 10}}>
            < View style = {{backgroundColor: '#cccccc90', flexDirection: 'column', width: 250, height: 250, padding: 10,
              borderRadius: 150, borderColor:'black', borderWidth:0.5, justifyContent:'center',
              flex: 1, 
              }}>
              <View style={{ height: 50, justifyContent:'center', alignItems: 'center'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 15, fontStyle: 'italic'}}>{Math.round(this.state.magnitude).toFixed(2)} deg/s</Text>
                <Text>Rotation Speed</Text>
              </View>
              <View style={{ height: 200, justifyContent: 'center'}}>
                <Thumbnail large 
                source={require('../assets/vighter.png')} 
                style={{justifyContent:'center', alignSelf:'center', width: 200, height: 200, padding: 20}} />
              </View>
              <View style={{height: 50, justifyContent: 'center' , alignItems: 'center'}}>
              {
                this.state.isTrue ?
                  this.state.magnitude < 4 ? (
                    <View>
                      <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Too Weak</Text>
                    </View>
                  )
                  : this.state.magnitude < 7 ? (
                    <View>
                      <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Need More Power</Text>
                    </View>
                  )
                  : this.state.magnitude < 11 ? (
                    <View>
                      <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Good</Text>
                    </View>
                  )
                  : (
                    <View>
                      <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Need More Power</Text>
                    </View>
                  )
                : (
                  <View>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>You Did the Wrong Move</Text>
                  </View>
                )
              }
                <Text>Punch Status</Text>              
              </View>
            </View>
          </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    gyroscope: {
      ...state.gyroscopeReducer
    },
    gyroscopeArray: [
      ...state.gyroscopeArrayReducer
    ],
    token: state.tokenReducer
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    assignGyroscope,
    assignGyroscopeArray,
    resetGyroscopeArray,
    setToken
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainController)