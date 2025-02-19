import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View,Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';


export default function Homepage() {


  return (

  <Provider store={store}>
    <TouchableWithoutFeedback >
    <View style={styles.container} >
<Navbar/>
      <StatusBar style="auto" />
      <Text>hello world</Text>
      <View style={styles.imageContainer}>
          
      </View>

      <Footer/>
    </View>
    </TouchableWithoutFeedback>
  </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});