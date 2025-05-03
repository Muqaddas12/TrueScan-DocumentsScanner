import * as FileSystem from 'expo-file-system'
import RNFS from 'react-native-fs'
const getImageFiles=async ()=>{
    
const imageDirectory = `${RNFS.DownloadDirectoryPath}/TrueScan/.ImagesFiles/`
 const directoryExists = await RNFS.exists(imageDirectory);
    if (!directoryExists) {
      console.log('Directory does not exist.');
      return [];
    }
    const ImageFiles = await RNFS.readDir(imageDirectory);

const reverseArrayImages=ImageFiles
const imagesUri=reverseArrayImages.map(val=>{
return imageDirectory+val.name
})

return imagesUri


}


export default getImageFiles