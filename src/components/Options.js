import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import ImagePicker from 'react-native-image-crop-picker'
import { router } from 'expo-router'
const { width, height } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import { notVisible, } from "../redux/store";

const Options = () => {
  const dispatch=useDispatch()
  const launchGallery=async () => {
    
const result=await ImagePicker.openPicker({
  multiple:true,
  mediaType:'photo',
  cropping:true,

})

router.push({
  pathname:'SelectedImages',
  params:{data:JSON.stringify(result)}
})
  }

  return (
 <TouchableWithoutFeedback onPress={()=>dispatch(notVisible())}>
     <View style={styles.optioncContainer}>
    <View style={styles.optionsubContainer}>
    <View style={styles.header}>
            <Text style={styles.headerText}>Choose Photos From:</Text>
        </View>
      <TouchableOpacity style={styles.subContainer}>
        <Text style={styles.optionText}>Scan Documents</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.subContainer}
      onPress={launchGallery}
      >
        <Text style={styles.optionText}>Gallery</Text>
      </TouchableOpacity>
    </View>
    </View>
 </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  optioncContainer: {
    position: 'absolute',
   bottom:0,  // You can adjust this to position it correctly
    alignItems: 'center',
    justifyContent: 'center',
width:width,
    zIndex:1000,
    height:height,
  },
  optionsubContainer:{
position:'absolute',
bottom:0
  },
  subContainer: {
    borderBottomWidth: 0.5,
    width: width,
    paddingVertical: 12,  // Added padding for better touch area
    
    
  },
  optionText: {
    fontSize: 22,  // Reduced the font size a bit for better balance
    fontWeight: '300',  // Slightly bold text for a clean look
    color: 'red',  // Darker text for contrast
    textAlign: 'center',  // Center-align the text
  },
  header:{
    marginVertical:10,
    borderBottomWidth:.2,
    width:width,
    alignItems:'center',
    justifyContent:'center',

  },
  headerText:{
    padding:10,
    fontSize:15,
  }
});

export default Options;
