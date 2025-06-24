import { createPdf } from "react-native-images-to-pdf";
import * as ImageManipulator from 'expo-image-manipulator';
import RNFS from 'react-native-fs'
// Function to create a PDF from images
const makePdf = async (imagesArray) => {
   
    const date = Date.now();
const desUri=`${RNFS.DownloadDirectoryPath}/TrueScan/PdfFiles/`
const imageDirectory = `${RNFS.DownloadDirectoryPath}/TrueScan/.ImagesFiles/`
    //checking pdffiles dic exists or not
    if(!await RNFS.exists(imageDirectory)){
        await RNFS.mkdir(imageDirectory)
  
       }
    if(!await RNFS.exists(desUri)){

        await RNFS.mkdir(desUri)
   
    }
    else{

    }



    const A4_WIDTH = 2480;
    const A4_HEIGHT = 3508;

    try {
        // Normalize image paths from mixed objects and strings
        const normalizedPaths = imagesArray.map((item) =>
            typeof item === 'string' ? item : item.path
        );

        // Resize all images to A4 size
        const resizedImages = await Promise.all(
            normalizedPaths.map(async (imagePath) => {
                const resizedImage = await ImageManipulator.manipulateAsync(
                    imagePath,
                    [{ resize: { width: A4_WIDTH, height: A4_HEIGHT } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                );
                return { imagePath: resizedImage.uri, width: A4_WIDTH, height: A4_HEIGHT };
            })
        );

        // Create PDF from resized images
        const options = {
            pages: resizedImages,
            outputPath: `${desUri}TrueScan_${date}.pdf`,
            quality:5
        };

        const result = await createPdf(options);
        console.log('PDF created successfully:', result);

       
        await RNFS.copyFile(resizedImages[0].imagePath,`${imageDirectory}TrueScan_${date}.png`)

    } catch (error) {
        console.error('Error creating PDF:', error);
    }
};

export default makePdf;
