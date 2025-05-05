import React, { useState, useEffect } from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
import ImagePicker from 'react-native-image-crop-picker';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ScrollView, 
    Dimensions, 
    ActivityIndicator, 
    ToastAndroid
} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Navbar from "../src/components/Navbar";
import makePdf from "../src/helpers/makePdf";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch,useSelector } from 'react-redux';
import { setTempUri,clearTempUri } from '../src/redux/store';
const { width, height } = Dimensions.get('window');

const ScannedImagesContainer = () => {
 const dispatch=useDispatch()
 let routeCheck=useLocalSearchParams().data
 const router = useRouter();
    const [Images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [optionToggleClick,setOptionToggleClick]=useState(false)
    const imageUri = useSelector(state => state.tempUri.uri);
 

    // Function to remove an image
    const removeImage = (index) => {
        setLoading(true);
        setLoadingMessage("Removing image...");
        try {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    // Function to create a PDF
    const handleCreatePdf = async () => {
        if (Images.length === 0){
            ToastAndroid.show('Please scan or select image at least one image ',ToastAndroid.LONG)
            return;
        } 

        setLoading(true);
        setLoadingMessage("Creating PDF in progress…");
        try {
            await makePdf(Images);
           dispatch(setTempUri(null))

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
 // Function to add new images with loading
 const addImage = async () => {
    setOptionToggleClick(false)
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
       // Show the error as a toast
ToastAndroid.show('Error selecting images: ' + error.message, ToastAndroid.LONG);
    } finally {
        setLoading(false);
        setLoadingMessage("");
    }
};
    // Function to initiate document scanning
    const handleAddImage = async () => {
       setOptionToggleClick(false)
        const { scannedImages,status } = await DocumentScanner.scanDocument();
   if(status==='cancel'&&Images.length===0){
router.replace('/')
   }
        if (scannedImages.length > 0) {
            setImages(prev => [...prev, ...scannedImages]);
        }
    };

    useEffect(() => {
        
        if(routeCheck){
            dispatch(setTempUri(null))
        }
       
        if(imageUri){
            setImages(imageUri)
        }else{
       
            
            handleAddImage();
        }
      
        
    }, []);

        
const optionToggle=()=>{
    setOptionToggleClick(false)
    }
const saveImageUriBeforeRouteChange=(res)=>{
dispatch(setTempUri(Images))
    router.push({
        pathname:'imageView',
        params:{sourceUri: typeof res === 'string' ? res : res.path}
       })
}
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
                {Images.map((res, index) => (
                    <View style={styles.imageView} key={index}>
                            
                                  <TouchableOpacity accessibilityRole='checkbox' onPressOut={accessibilityRole}   style={styles.userImage}   onPress={()=>saveImageUriBeforeRouteChange(res)}>
                                            <Image
                                   style={styles.userImage} 
                                   source={{ uri: typeof res === 'string' ? res : res.path }} 
                                 />
                                            </TouchableOpacity>
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
                <TouchableOpacity style={styles.addButton} disabled={loading} onPress={()=>{setOptionToggleClick(true)}}>
                    <Icon name="plus" style={styles.plusIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreatePdf} style={styles.createPdfButton} disabled={loading}>
                    <Text style={styles.createPdfText}>Create PDF</Text>
                </TouchableOpacity>
            </View>

            {optionToggleClick && (
              <TouchableOpacity style={styles.optionToggle} onPress={optionToggle}>
            
                <View style={[styles.options, { position: 'absolute', bottom: 0, left: 0, right: 0 }]}>
                <TouchableOpacity onPress={handleAddImage}>
                    <Text style={styles.optionText}>Scan Documents</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={addImage}>
                    <Text style={styles.optionText}>Gallery</Text>
                  </TouchableOpacity>
                 
            
              </View>
              </TouchableOpacity>
            )}




 



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
        elevation: 3,
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
    optionToggle:{

        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        width:width,
        backgroundColor:'transparent',
        zIndex:10000,
        
            },
            options: {
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 10,
                elevation: 5, // for Android shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
              optionText: {
                fontSize: 16,
                marginVertical: 8,
                textAlign: 'center',
                color: '#333',
              },
});

export default ScannedImagesContainer;