import React from "react";
import { View, Text, Image, StyleSheet,Dimensions } from "react-native";
const {width,height}=Dimensions.get('window')
const Navbar = () => {
  return (
    <View style={styles.navbarContainer}>
   
      {/* <Image
        source={require('./path-to-your-logo.png')} // Change path to your logo
        style={styles.logo}
      /> */}
      <Text style={styles.title}>DocScanner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    
    flexDirection: 'row',  // Align logo and title in a row
    alignItems: 'center',  // Vertically center the items
    justifyContent: 'space-between',  // Add spacing between logo and title
    backgroundColor: '#4CAF50',  // Navbar background color
    padding: 10,  // Padding for the navbar
    position:'absolute',
    top:10,
    width:width,
  },
  logo: {
    width: 40,  // Adjust size of the logo
    height: 40,
    resizeMode: 'contain',  // Make sure the logo is contained without distortion
  },
  title: {
    color: '#fff',  // White text color for contrast
    fontSize: 24,  // Font size for the title
    fontWeight: 'bold',  // Make the title bold
  },
});

export default Navbar
