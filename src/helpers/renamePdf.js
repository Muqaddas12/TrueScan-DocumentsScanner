import prompt from "react-native-prompt-android";
import * as FileSystem from 'expo-file-system';

const renamePdf = (pdfUri, onSuccess) => {
    try {
        const directory = pdfUri.substring(0, pdfUri.lastIndexOf('/') + 1);

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

                        const newUri = `${directory}${newName}.pdf`;

                        // Check if the new name already exists
                        const fileExists = await FileSystem.getInfoAsync(newUri);
                        if (fileExists.exists) {
                            alert('File with this name already exists!');
                            return;
                        }

                        // Perform rename operation
                        await FileSystem.moveAsync({
                            from: pdfUri,
                            to: newUri,
                        });

                        console.log('PDF renamed successfully:', newUri);
                        alert('PDF renamed successfully!');

                        // Trigger callback to update UI
                        if (onSuccess) onSuccess(newUri);
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
