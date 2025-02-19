import { Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker'

export const launchGallery=async ()=>{
let result= await ImagePicker.launchImageLibraryAsync({
    mediaTypes:['images'],
    allowsEditing:true,
    aspect:[4,3],
    quality:1
}) 
console.log(result)

}

