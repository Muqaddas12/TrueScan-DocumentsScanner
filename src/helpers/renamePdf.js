import { Alert, Platform, TextInput } from 'react-native';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';

const renamePdf = async (uri) => {
    if (Platform.OS === 'ios') {
        Alert.prompt('Rename PDF', 'Enter new name:', async (text) => {
            if (text) {
                await handleRename(uri, text);
            }
        });
    } else {
        showAndroidPrompt(uri);
    }
};

const showAndroidPrompt = (uri) => {
    const [newName, setNewName] = useState('');

    Alert.alert(
        'Rename PDF',
        'Enter new name:',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: async () => {
                    if (newName) {
                        await handleRename(uri, newName);
                    }
                },
            },
        ],
        { cancelable: true }
    );
};

const handleRename = async (uri, newName) => {
    try {
        const directory = uri.substring(0, uri.lastIndexOf('/') + 1);
        const newUri = `${directory}${newName}.pdf`;

        await FileSystem.moveAsync({
            from: uri,
            to: newUri,
        });

        console.log('PDF renamed successfully to:', newUri);
    } catch (error) {
        console.error('Error renaming PDF:', error);
    }
};

export default renamePdf;
