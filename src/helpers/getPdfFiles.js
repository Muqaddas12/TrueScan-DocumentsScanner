import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to read PDF files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }
  return true; // iOS handles permissions differently
};

const getPdfFiles = async () => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.log('Storage permission denied');
    return [];
  }

  const pdfDirectory = `${RNFS.DownloadDirectoryPath}/TrueScan/PdfFiles/`;
 

  try {
    const directoryExists = await RNFS.exists(pdfDirectory);
    if (!directoryExists) {
      console.log('Directory does not exist.');
      return [];
    }

    const pdfFiles = await RNFS.readDir(pdfDirectory);
   
    const detailedPdfFiles = pdfFiles.map(pdfFile => ({
      path: pdfFile.path,
      name: pdfFile.name,
      size: pdfFile.size,
      isFile: pdfFile.isFile(),
      isDirectory: pdfFile.isDirectory(),
      modificationDate: pdfFile.mtime,
    }));

    return detailedPdfFiles;
  } catch (error) {
    console.error('Error reading PDF files:', error);
    return [];
  }
};

export default getPdfFiles;
