import * as FileSystem from 'expo-file-system'

const getImageFiles=async ()=>{
    
const imageDirectory=FileSystem.documentDirectory+'imageFiles/'
const imagesArray= await FileSystem.readDirectoryAsync(imageDirectory)
const reverseArrayImages=imagesArray.reverse()
const imagesUri=reverseArrayImages.map(val=>{
return imageDirectory+val
})
return imagesUri


}


export default getImageFiles