import * as Sharing from 'expo-sharing';

const sharePdf = async (uri) => {
    try {
        const isShareable = await Sharing.isAvailableAsync();
        
        if (!isShareable) {
            console.error('Sharing is not available on this device.');
            return;
        }
        
        await Sharing.shareAsync(uri);
    } catch (error) {
        console.error('Error sharing PDF:', error);
    }
};

export default sharePdf;
