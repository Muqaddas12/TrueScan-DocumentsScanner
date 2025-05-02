import RNFS from 'react-native-fs';

const getPdfFiles = async () => {
    const pdfDirectory = `${RNFS.DownloadDirectoryPath}/TrueScan/PdfFiles/`;

    try {
        // Check if the directory exists
        const directoryExists = await RNFS.exists(pdfDirectory);
        if (!directoryExists) {
            console.log("Directory does not exist.");
            return []; // Return empty array if directory doesn't exist
        }

        // Read files from the directory
        const pdfFiles = await RNFS.readDir(pdfDirectory);

        // Get detailed information for each PDF file
        const detailedPdfFiles = pdfFiles.map(pdfFile => {
            return {
                path: pdfFile.path,
                name: pdfFile.name,
                size: pdfFile.size,
                isFile: pdfFile.isFile(),
                isDirectory: pdfFile.isDirectory(),
            
                modificationDate: pdfFile.mtime, // Last modified date
            };
        });

        return detailedPdfFiles;
    } catch (error) {
        console.error("Error reading PDF files:", error);
        return []; // Return empty array on error
    }
};

export default getPdfFiles;
