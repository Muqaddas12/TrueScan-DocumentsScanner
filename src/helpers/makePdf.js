import { createPdf } from "react-native-images-to-pdf";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// Function to create a PDF from images
const makePdf = async (imagesArray) => {
    const date = Date.now();
    console.log('imagesArray:', imagesArray);

    // A4 dimensions in pixels (300 DPI)
    const A4_WIDTH = 2480;
    const A4_HEIGHT = 3508;

    // Ensure PDF and image directories exist
    const pdfDirectory = `${FileSystem.documentDirectory}pdfFiles/`;
    const imageDirectory = `${FileSystem.documentDirectory}imageFiles/`;

    await FileSystem.makeDirectoryAsync(pdfDirectory, { intermediates: true }).catch(() => {});
    await FileSystem.makeDirectoryAsync(imageDirectory, { intermediates: true }).catch(() => {});

    try {
        // Resize images to A4 size
        const resizedImages = await Promise.all(
            imagesArray.map(async (image) => {
                const resizedImage = await ImageManipulator.manipulateAsync(
                    image.path,
                    [{ resize: { width: A4_WIDTH, height: A4_HEIGHT } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                );
                return { imagePath: resizedImage.uri, width: A4_WIDTH, height: A4_HEIGHT };
            })
        );

        // Create PDF from resized images
        const options = {
            pages: resizedImages,
            outputPath: `${pdfDirectory}${date}.pdf`,
        };

        const result = await createPdf(options);
        console.log('PDF created successfully:', result);

        // Save the first image as reference
        await FileSystem.copyAsync({
            from: resizedImages[0].imagePath,
            to: `${imageDirectory}${date}.png`,
        });

    } catch (error) {
        console.error('Error creating PDF:', error);
    }
};

export default makePdf;
