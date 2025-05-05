import RNFS from 'react-native-fs';



const getPdfFiles = async () => {
  

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
