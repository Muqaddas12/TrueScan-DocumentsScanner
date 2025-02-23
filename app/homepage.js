import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Animated, ScrollView, ActivityIndicator } from 'react-native';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import getPdfFiles from '../src/helpers/getPdfFiles';
import getImageFiles from '../src/helpers/getImageFiles';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import deletePdf from '../src/helpers/deletePdf';
import sharePdf from '../src/helpers/sharePdf';


const { width, height } = Dimensions.get('window');

export default function Homepage() {
  const { msg } = useLocalSearchParams(); // Get msg from router params
  const [imagesUri, setImagesUri] = useState([]);
  const [pdfFilesInfo, setPdfFilesInfo] = useState([]);
  const slideAnim = new Animated.Value(0);
  const [showMsg, setShowMsg] = useState(msg || '');
  const [pdfMenuVisible, setPdfMenuVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconVisible,setIconVisible]=useState(false)

 
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

  const togglePdfMenu = (uri) => {
    setPdfMenuVisible(true);
    setPdfUri(uri);
  };

  const pdfMenuHandler = async (item) => {
    setLoading(true); // Show loader
    switch (item) {
      case 'Open': {
        router.push({
          pathname: 'renderPdf',
          params: { image: pdfUri },
        });
        break;
      }
      case 'Share': {
        await sharePdf(pdfUri);
        break;
      }
      case 'Delete': {
        await deletePdf(pdfUri);
        const updatedPdfs = pdfFilesInfo.filter((pdf) => pdf.uri !== pdfUri);
        setPdfFilesInfo(updatedPdfs); // Update UI after deletion
        setShowMsg('PDF deleted successfully!');
        break;
      }
      case 'Rename': {
       
        break;
      }
      default:
        break;
    }
    setPdfMenuVisible(false);
    setLoading(false); // Hide loader
  };

  return (
   
      <TouchableWithoutFeedback style={{flex:1}}>
        <View style={styles.mainContainer}>
          <Navbar />
          <StatusBar style="auto" />

          {/* Message Display */}
          {showMsg ? <Text style={styles.successMessage}>{showMsg}</Text> : null}

          <ScrollView contentContainerStyle={styles.pdfListContainer}>
            {pdfFilesInfo.length > 0 ? (
              pdfFilesInfo.map((pdf, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={() => togglePdfMenu(pdf.uri)} style={styles.pdfItem}>
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
        

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6200EE" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    
  
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: width,
    height:height,
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
  footerWrapper: {
    height: height * 0.1,
  },
  menuOverlay: {
    position: 'absolute',
    height:height,
    borderWidth:4,
    width:width,
    backgroundColor:'red',
    
  },
  animatedMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  menuOption: {
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 18,
  },
});
