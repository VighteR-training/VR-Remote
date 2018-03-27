import React, {Component} from 'react';
import {View, RefreshControl} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text
} from 'native-base';

import {AsyncStorage, ActivityIndicator} from 'react-native';

import axios from 'axios';

export default class Logs extends Component {
  constructor(props){
    super(props)
    this.state = {
      logs: [],
      loading: true,
      token: null,
      refreshing: false
    }
  }
  
  componentDidMount() {
    AsyncStorage.getItem('token', (err, val) => {
      setTimeout(() => {
        this.setState({token: val})
      }, 2000);
    });
    
    setTimeout(() => {
      this._getLogs(payload => {
        this.setState({
          logs: payload.data.payload,
          loading: false
        })
      })
    }, 3000);
  }

  _getLogs(callback){
    axios.get('https://alanglab-189602.appspot.com/log', {
        headers: {
          token: this.state.token
        }
      })
      .then(payload => {
        callback(payload)
      })
      .catch(error => {
        console.log(error);
      });
  }

  static navigationOptions = {
    title: 'Logs',
    headerTitleStyle : {
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent'
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getLogs(payload => {
      this.setState({refreshing: false, logs: payload.data.payload});
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#000"/>
        </View>
      )
    } else {
    return (
      <Container>
        <Content refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)}/>
        }>
          <List>
            {
              this.state.logs.map((item, index) => (
                <ListItem key={index}>
                  <Body>
                    <Text>{item.type}</Text>
                    <Text note>Practicing {item.type} . .</Text>
                  </Body>
                  <Right>
                    <Text note>{item.power}</Text>
                    <Text note>{item.status}</Text>
                  </Right>
                </ListItem>
              ))
            }
          </List>
        </Content>
      </Container>
    );
    }
  }
}