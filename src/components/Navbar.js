import React from "react";
import { View, Text, Image, StyleSheet,Dimensions } from "react-native";
const {width,height}=Dimensions.get('window')
const Navbar = () => {
  return (
    <View style={styles.navbarContainer}>
   
      <Image
        source={require('../images/headerLogo.png')} // Change path to your logo
        style={styles.logo}
      />
      <Text style={styles.title}>TrueScan</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    
    flexDirection: 'row',  // Align logo and title in a row
    alignItems: 'center',  // Vertically center the items
  
    backgroundColor: '#5e46b4',  // Navbar background color
    padding: 10,  // Padding for the navbar
    position:'absolute',
    width:width,
    zIndex:1000,
  },
  logo: {
    width: 30,  // Adjust size of the logo
    height: 30,
    resizeMode: 'contain',  // Make sure the logo is contained without distortion
    borderRadius:10,
    marginRight:10,
  },
  title: {
    color: '#fff',  // White text color for contrast
    fontSize: 24,  // Font size for the title
    fontWeight: 'bold',  // Make the title bold
  },
});

export default Navbar
