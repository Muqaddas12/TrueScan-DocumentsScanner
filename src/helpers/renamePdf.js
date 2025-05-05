import prompt from "react-native-prompt-android";
import RNFS from 'react-native-fs'
import { ToastAndroid } from "react-native";


const renamePdf =  async(name) => {

  const desUri=`${RNFS.DownloadDirectoryPath}/TrueScan/PdfFiles/`
  const imageDirectory = `${RNFS.DownloadDirectoryPath}/TrueScan/.ImagesFiles/`
  const imageName=name.replace('.pdf','.png')
    try {
       

        prompt(
            'Rename PDF',
            'Enter a new name for the PDF:',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Rename cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Rename',
                    onPress: async (newName) => {
                        if (!newName) {
                            alert('Name cannot be empty');
                            return;
                        }

                        const newPdfUri = `${desUri}${newName}.pdf`;
                        const newImageUri=`${imageDirectory}${newName}.png`                       

                        await RNFS.moveFile(`${desUri}${name}`,newPdfUri)
                        await RNFS.moveFile(`${imageDirectory}${imageName}`,newImageUri)
                       

                        ToastAndroid.show('PDF renamed successfully!',ToastAndroid.LONG)

                    },
                    style: 'default',
                },
            ],
            {
                placeholder: 'Enter new name',
                cancelable: true,
            }
        );
    
    } catch (error) {
        console.error('Error renaming PDF:', error);
        alert('Failed to rename PDF');
    }


};

export default renamePdf;
