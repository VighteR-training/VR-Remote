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

import {AsyncStorage} from 'react-native';

import axios from 'axios';

export default class Logs extends Component {
  constructor(props){
    super(props)
    this.state = {
      logs: [],
      loading: true,
      token: null
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('token', (err, val) => {
      setTimeout(() => {
        this.setState({token: val})
      }, 2000);
    })
  }

  componentDidMount() {
axios
  .get('http://35.187.249.39:8000/log', {
  headers: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWI3ZmMzOWYzODM1NzBlYTk3ZGNjMjk' +
        'iLCJuYW1lIjoiTHV0aGZpIiwiZW1haWwiOiJqa3QubHV0aGZpQGdtYWlsLmNvbSIsImlhdCI6MTUyMjA' +
        'zNjU4NH0.yq_5WXA0suLpJyvxZM4nWxwCfoy8TtaTnc1wp13D7gM'
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
          <Text>Loading...</Text>
        </Content>
      </Container>
      )
    } else {
    return (
      <Container>
        <Content>
          <List>
            {
              this.state.logs.map(item => (
                <ListItem>
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