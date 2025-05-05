import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  NativeModules
} from "react-native";

import ReactNativeBlobUtil from 'react-native-blob-util'
const { TrueScanStorage } = NativeModules;

const { width, height } = Dimensions.get("window");

const ImageView = () => {
  const { sourceUri } = useLocalSearchParams();



  // Function to export and save image
  const exportAsImage = async () => {
    try {
     
      const cleanedUri = sourceUri.replace("file://", "");
      const fileName = `TrueScan_${Date.now()}.jpg`;
  
      // Call native module to get or create the TrueScan folder path
      const folderPath = await TrueScanStorage.createTrueScanDownloadFolder();
  
      const savePath = `${folderPath}/${fileName}`;
  
      // Copy file using react-native-blob-util
      await ReactNativeBlobUtil.fs.cp(cleanedUri, savePath);
  
      Alert.alert("Saved!", `Image saved to: ${savePath}`);
    } catch (err) {
      console.error("Error saving image:", err);
      Alert.alert("Error", "Failed to save image.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={{ uri: sourceUri }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.button} onPress={exportAsImage}>
        <Text style={styles.buttonText}>Export As Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: width * 0.9,
    height: height * 0.8,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ImageView;
