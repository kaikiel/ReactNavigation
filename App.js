/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {NetInfo, Platform, StyleSheet, Text, View, FlatList, Button, ActivityIndicator, Image} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      data: [],
    }
  }

  
  onRefresh(){
    this.setState({ isFetching: true });
    console.log(this.state.data);
    
    this.fetchData();
    
  }
  
  componentDidMount(){
    this.fetchData();

    if (Platform.OS === 'android') {
      NetInfo.isConnected.fetch().then(isConnected => {
          console.warn('Expected to see value logged: ', isConnected);
      })
    }
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        (value) => {
            console.warn('Expected to see value logged: ', value);
        }
    );

  }
  fetchData(){
    fetch('http://172.104.32.90:8095/Plone/@search?fullobjects=1&portal_type=BikeIntro&sort_on=getObjPositionInParent',{
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46b25seTRvaW51eA=='
      }
    })
    .then((response) => response.json())
    .then((json) => {
      
      this.setState({data: json.items})
      this.setState({ isFetching: false });
    })
    .catch((error) => {
      console.log(error);
      
    })
  }

  _renderItem = (item) => (
    <View style={{flexDirection: 'column',flex: 1}}>
      <AutoHeightImage width={100} resizeMode={'cover'} style={{width: 100, flex: 1}} source={{uri: `${item.image.download}`}} />
      <Text style={{flex: 2}}>{item.title}</Text>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Button title="clean" onPress={() => {this.setState({data: []});} } />
        <FlatList
          style={{flex: 1}}
          data={ this.state.data }
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item}) => this._renderItem(item)}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          ListEmptyComponent={() => {
            
            return <ActivityIndicator size="large" color="#0000ff" />
          }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
