import React, {Component} from 'react';
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
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('token', (err, val) => {
      setTimeout(() => {
        this.setState({token: val})
      }, 2000);
    });
  }

  componentDidMount() {
    setTimeout(() => {
      axios
        .get('https://alanglab-189602.appspot.com/log', {
        headers: {
          token: this.state.token
        }
      })
        .then(payload => {
            this.setState({
              logs: payload.data.payload,
              loading: false
            })
          })
          .catch(error => {
            console.log(error);
          });
    }, 3000);
  }

  static navigationOptions = {
    title: 'Logs',
    headerTitleStyle : {
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent'
    }
  }

  render() {
    if (this.state.loading) {
      return (
      <Container>
        <Content>
          <ActivityIndicator size="large" color="#000" style={{marginTop: 200}} />
        </Content>
      </Container>
      )
    } else {
    return (
      <Container>
        <Content>
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