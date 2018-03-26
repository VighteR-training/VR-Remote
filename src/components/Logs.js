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
      logs: []
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('token', (err, val) => {
      this.setState({
        token: val
      });
    })
  }

  componentDidMount() {
    axios.get('http://35.187.249.39:8000/log').then(payload => {
      console.log(payload);
    })
    .catch(error => {
      console.log(error);
    });
    console.log(this.state.token)
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
    return (
      <Container>
        <Content>
          <List>
            <ListItem>
              <Body>
                <Text>Jab</Text>
                <Text note>Practicing jab . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Uppercut</Text>
                <Text note>Practicing uppercut . .</Text>
              </Body>
              <Right>
                <Text note>3:53 pm</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}