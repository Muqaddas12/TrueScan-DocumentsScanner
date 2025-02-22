import * as FileSystem from "expo-file-system";

const getPdfFiles = async () => {
    const pdfDirectory = FileSystem.documentDirectory + "pdfFiles/";

    try {
        const info = await FileSystem.getInfoAsync(pdfDirectory);

        if (!info.exists || !info.isDirectory) {
            console.log("Directory does not exist.");
            return []; // Return empty array instead of undefined
        }

        const pdfFiles = await FileSystem.readDirectoryAsync(pdfDirectory);
      const detailedPdfFiles=await Promise.all(
        pdfFiles.map(async(pdfname)=>{
            return await FileSystem.getInfoAsync(pdfDirectory+pdfname)
        })
      )
      
        
        
        return detailedPdfFiles;
    } catch (error) {
        console.error("Error reading PDF files:", error);
        return []; // Return empty array on error
    }
};

export default getPdfFiles;
