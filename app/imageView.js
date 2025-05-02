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
  PermissionsAndroid,
  Platform,
} from "react-native";
import RNFS from "react-native-fs";
import ReactNativeBlobUtil from 'react-native-blob-util'

const { width, height } = Dimensions.get("window");

const ImageView = () => {
  const { sourceUri } = useLocalSearchParams();

  // Requesting permission for Android to access storage
  const requestPermission = async () => {
    if (Platform.OS === "android" ) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true; // for iOS or Android 13+ assume auto grant
  };

  // Function to export and save image
  const exportAsImage = async () => {
    try {

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert("Permission denied", "Storage permission is required.");
        return;
      }
      console.log(hasPermission)

      const cleanedUri = sourceUri.replace("file://", ""); // Clean URI if needed
      const fileName = `TrueScan_${Date.now()}.jpg`; // File name with timestamp

      // Path to save the image
      const savePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      
const file=ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir

console.log(file)
      // await ReactNativeBlobUtil.fs.mkdir(`${file}/TrueScan`)
      // Ensure the directory exists
      // await RNFS.mkdir(`${RNFS.DownloadDirectoryPath}/TrueScan/`);

      // Copy the image to the desired location
      // await RNFS.copyFile(cleanedUri, savePath);
      await ReactNativeBlobUtil.fs.cp(cleanedUri,savePath)

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
