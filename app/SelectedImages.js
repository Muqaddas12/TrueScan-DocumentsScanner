import React, { useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ScrollView, 
    Dimensions, 
    ActivityIndicator 
} from "react-native";
import { router } from "expo-router";
import Icon from 'react-native-vector-icons/AntDesign';
import { useLocalSearchParams, usePathname } from "expo-router";
import ImagePicker from 'react-native-image-crop-picker';
import Navbar from "../src/components/Navbar";
const { width, height } = Dimensions.get('window');
import makePdf from "../src/helpers/makePdf";

const SelectedImages = () => {
    const result = JSON.parse(useLocalSearchParams().data);
    const [images, setImages] = useState(result);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // Function to remove an image with loading
    const removeImage = async (index) => {
        setLoading(true);
        setLoadingMessage("Removing image...");
        try {
            setImages(images.filter((_, i) => i !== index));
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    // Function to add new images with loading
    const addImage = async () => {
        setLoading(true);
        setLoadingMessage("Adding images...");
        try {
            const moreImages = await ImagePicker.openPicker({
                mediaType: 'photo',
                quality: 1,
                cropping: true,
                multiple: true
            });

            if (Array.isArray(moreImages)) {
                setImages(prevImages => [...prevImages, ...moreImages]);
            } else {
                setImages(prevImages => [...prevImages, moreImages]);
            }
        } catch (error) {
            console.error("Error selecting images:", error);
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const handleCreatePdf = async () => {
        setLoading(true);
        setLoadingMessage("Creating PDF in progress…");
        try {
            await makePdf(images);
            router.push({
                pathname: '/',
                params: { msg: 'PDF created successfully' },
            });
        } catch (error) {
            console.error("Error creating PDF:", error);
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };
    

    return (
        <View style={styles.container}>
            <Navbar />

            {/* Loading Overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#5e46b4" />
                        <Text style={styles.loadingText}>{loadingMessage}</Text>
                    </View>
                </View>
            )}

            {/* Image List */}
            <ScrollView contentContainerStyle={styles.imagesContainer}>
                {images.map((res, index) => (
                    <View style={styles.imageView} key={index}>
                        <Image style={styles.userImage} source={{ uri: res.path }} />
                        <View style={styles.imageFooter}>
                            <Text style={styles.imageIndex}>{index + 1}</Text>
                            <TouchableOpacity onPress={() => removeImage(index)} disabled={loading}>
                                <Icon name="delete" style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={addImage} style={styles.addButton} disabled={loading}>
                    <Icon name="plus" style={styles.plusIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreatePdf} style={styles.createPdfButton} disabled={loading}>
                    <Text style={styles.createPdfText}>Create PDF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#f8f8f8",
    },
    imagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingBottom: 20,
    },
    imageView: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#fff",
        margin: 10,
        elevation: 3, // Shadow for Android
    },
    userImage: {
        width: width * 0.4,
        height: height * 0.3,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    imageFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#fff",
    },
    imageIndex: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    deleteIcon: {
        fontSize: 22,
        color: "red",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    addButton: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: "#5e46b4",
        justifyContent: "center",
        alignItems: "center",
    },
    plusIcon: {
        fontSize: 24,
        color: "#fff",
    },
    createPdfButton: {
        backgroundColor: "#5e46b4",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    createPdfText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    loadingBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#5e46b4",
        fontWeight: "bold",
    },
});

export default SelectedImages;
