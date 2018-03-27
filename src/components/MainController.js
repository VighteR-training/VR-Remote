import React, { Component } from 'react';
import { Container, Content, Thumbnail, Card, CardItem, Header, Left, Body, Right, Title, Text, ListItem, List } from 'native-base';
import {View, AsyncStorage} from 'react-native';
import RNSensors from 'react-native-sensors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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
      email: 'vlootfie@gmail.com',
      orientation: {
        isPortrait: false,
        isLandscape: false,
        isPhone: false,
        isTablet: false
      },
      isTrue: false
    }
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
          this.getSignal(); //TODO: check this
      }
    });
  }

  componentWillUnmount() {
    gyroscopeObservable.stop();
  }

  saveHistoryIntoFirebase(obj) {
    db.ref(this.state.email.split('@')[0]).set({...obj, ready: false})
    .then(() => {
      this.props.resetGyroscopeArray();
    })
    .catch(err => {
      console.log(err);
    });
  }

  getSignal(callback){
    db.ref(this.state.email.split('@')[0]).on('value', (snapshot) => {
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
      <Container>
        <Content>
          <View style={{ justifyContent:'center', alignItems: 'center', marginTop: 10}}>
            < View style = {{backgroundColor: '#F0F0F0', width: 200, height: 200,
              borderRadius: 200, borderColor:'black', borderWidth:3, justifyContent:'center',
              flex: 1, 
              }}>
              <Thumbnail large 
              source={require('../assets/vighter.png')} 
              style={{justifyContent:'center', alignSelf:'center', width: 200, height: 200}} />
            </View>
          </View>
          <Card>
            <CardItem>
              <Body>
              <List>
                <ListItem>
                  <Text>Rotation Power : {this.state.magnitude}</Text>
                </ListItem>
                <ListItem>
                  <Text>
                    isPortrait = { this.state.orientation.isPortrait ? 'true\n' : 'false\n'}
                    isLandscape = { this.state.orientation.isLandscape ? 'true\n' : 'false\n'}
                    isPhone = { this.state.orientation.isPhone ? 'true\n' : 'false\n'}
                    isTablet = {this.state.orientation.isTablet ? 'true\n' : 'false\n'}
                  </Text>
                </ListItem>
              </List>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
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

// TODO: Bug state