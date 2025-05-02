import Share from 'react-native-share';
import RNFS from 'react-native-fs'
const sharePdf = async (name) => {
  try {
    const desUri=`${RNFS.DownloadDirectoryPath}/TrueScan/PdfFiles/`
    const options = {
      title: 'Share PDF',
      url: `file://${desUri}${name}`, 
      type: 'application/pdf',
      failOnCancel: false,
    };

    await Share.open(options);
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
};

export default sharePdf;
