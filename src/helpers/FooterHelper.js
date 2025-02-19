
import { launchImageLibrary } from "react-native-image-picker"

export const launchGallery=async ()=>{

const result=launchImageLibrary({
    mediaType:['photo'],
    quality:1,

})
console.log('result',result)
}

