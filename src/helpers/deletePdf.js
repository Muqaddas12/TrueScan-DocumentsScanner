import * as FileSystem from 'expo-file-system';

const deletePdf = async (uri) => {
    try {
        const imageUri = uri.replace('file:///data/user/0/com.docscanner/files/pdfFiles/', '').replace('.pdf', '.png');
        const imageDirectory = `${FileSystem.documentDirectory}imageFiles/${imageUri}`;
        
        await FileSystem.deleteAsync(uri, { idempotent: true });
        await FileSystem.deleteAsync(imageDirectory, { idempotent: true });
        console.log('deleted successfully')
    } catch (error) {
        console.error('Error deleting files:', error);
    }
};

export default deletePdf;
