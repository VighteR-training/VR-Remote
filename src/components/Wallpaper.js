import React, { Component } from 'react';

import bgSrc from '../assets/wallpaper.jpg';
import {StyleSheet, Image} from 'react-native';

export default class Wallpaper extends Component {
  constructor (props) {
    super(props)
  }

  render(){
    <Image style={styles.picture} source={bgSrc}>
      {this.props.children}
    </Image>
  }
}

const styles = StyleSheet.create({
  picture: {
    flex:1,
    width: null,
    height: null,
    resizeMode: 'cover'
  }
})