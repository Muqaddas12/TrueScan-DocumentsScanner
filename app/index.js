import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Animated, ScrollView, BackHandler } from 'react-native';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import getPdfFiles from '../src/helpers/getPdfFiles';
import getImageFiles from '../src/helpers/getImageFiles';
import { useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Homepage() {
  const { msg } = useLocalSearchParams(); // Get msg from router params
  const [imagesUri, setImagesUri] = useState([]);
  const [pdfFilesInfo, setPdfFilesInfo] = useState([]);
  const slideAnim = new Animated.Value(0);
  const [showMsg, setShowMsg] = useState(msg || '');
  const [pdfMenuVisible, setPdfMenuVisible] = useState(false);

  // Fetch PDF files
  useEffect(() => {
    const fetchPdfFiles = async () => {
      const pdfFiles = await getPdfFiles();
      setPdfFilesInfo(pdfFiles);
    };
    fetchPdfFiles();
  }, []);

  // Fetch PDF Images
  useEffect(() => {
    const fetchImages = async () => {
      const result = await getImageFiles();
      setImagesUri(result);
    };
    fetchImages();
  }, []);

  // Hide message after 3 seconds
  useEffect(() => {
    if (showMsg) {
      const timer = setTimeout(() => setShowMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMsg]);

  // Date formatting
  const formatDate = (modificationTime) => {
    const timestamp = modificationTime * 1000; // Convert seconds to milliseconds
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Toggle PDF Menu
  const togglePdfMenu = () => {
    if (pdfMenuVisible) {
      closePdfMenu();
    } else {
      openPdfMenu();
    }
  };

  // Open Menu Animation
  const openPdfMenu = () => {
    setPdfMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close Menu Animation
  const closePdfMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setPdfMenuVisible(false));
  };

  // Handle Back Press (Android Back Button)
  useEffect(() => {
    const handleBackPress = () => {
      if (pdfMenuVisible) {
        closePdfMenu();
        return true; // Prevents default back action
      }
      return false; // Allows default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove(); // Clean up listener
  }, [pdfMenuVisible]);

  return (
    <Provider store={store}>
      <TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <Navbar />
          <StatusBar style="auto" />

          {/* Message Display */}
          {showMsg ? <Text style={styles.successMessage}>{showMsg}</Text> : null}

          <ScrollView contentContainerStyle={styles.pdfListContainer}>
            {pdfFilesInfo.length > 0 ? (
              pdfFilesInfo.map((pdf, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={togglePdfMenu} style={styles.pdfItem}>
                    <Image source={{ uri: imagesUri[index] }} style={styles.pdfThumbnail} />
                    <View style={styles.pdfDetailsContainer}>
                      <Text style={styles.pdfTitle}>
                        {pdf.uri.replace('file:///data/user/0/com.docscanner/files/pdfFiles/', '')}
                      </Text>
                      <Text style={styles.pdfSize}>{(pdf.size / 1024 / 1024).toFixed(2)} MB</Text>
                      <Text style={styles.pdfDate}>{formatDate(pdf.modificationTime)}</Text>
                      <Text style={styles.pdfPath}>{pdf.uri.replace('file:///data/user/0/', '')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noPdfText}>No PDFs found</Text>
            )}
          </ScrollView>

          <View style={styles.footerWrapper}>
            <Footer />
          </View>

          {/* PDF Options Menu */}
          {pdfMenuVisible && (
            <View style={styles.menuOverlay}>
              <Animated.View
                style={[
                  styles.animatedMenu,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [height * 0.3, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {['Open', 'Share', 'Delete', 'Rename', 'Details'].map((item, idx) => (
                  <TouchableOpacity key={idx} onPress={closePdfMenu}>
                    <Text style={styles.menuOption}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Provider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: width,
  },
  successMessage: {
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  pdfListContainer: {
    marginTop: height * 0.08,
    marginHorizontal: 10,
    paddingBottom: 50,
  },
  pdfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  pdfThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  pdfDetailsContainer: {
    flex: 1,
    marginLeft: 15,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pdfSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  pdfDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  pdfPath: {
    fontSize: 12,
    color: '#bbb',
  },
  noPdfText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  footerWrapper: {
    height: height * 0.1,
  },
  menuOverlay: {
    position: 'absolute',
    top: height * 0.55,
    left: 0,
    right: 0,
  },
  animatedMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuOption: {
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
});
