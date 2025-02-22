import Pdf from "react-native-pdf";
import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useLocalSearchParams } from "expo-router";
const RenderPdf = () => {
const data=useLocalSearchParams()
    const source = { uri: data.image };

    return (
        <View style={styles.container}>
            <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`PDF loaded. Pages: ${numberOfPages}, Path: ${filePath}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Page changed: ${page} / ${numberOfPages}`);
                }}
                onError={(error) => {
                    console.error('PDF Error:', error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default RenderPdf;
