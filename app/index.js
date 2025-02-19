import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

export default function Homepage() {
  return (
    <View style={styles.container}>
<Navbar/>
      <StatusBar style="auto" />
      <Text>hellow world</Text>
      <View style={styles.imageContainer}>
         
      </View>

      <Footer/>
    </View>
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