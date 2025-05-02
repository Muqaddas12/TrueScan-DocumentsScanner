import RNFS from 'react-native-fs'

const deletePdf = async (name) => {
const desUri=`${RNFS.DownloadDirectoryPath}/TrueScan/PdfFiles/`
const imageDirectory = `${RNFS.DownloadDirectoryPath}/TrueScan/.ImagesFiles/`
const imageName=name.replace('.pdf','.png')
    try {
        await RNFS.unlink(`${desUri}${name}`)
        await RNFS.unlink(`${imageDirectory}${imageName}`)
        
        console.log('deleted successfully')
    } catch (error) {
        console.error('Error deleting files:', error);
    }
};

export default deletePdf;
