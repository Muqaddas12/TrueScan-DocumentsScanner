
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  PermissionsAndroid
} from 'react-native';
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
import renamePdf from '../src/helpers/renamePdf';
import formatDate from '../src/helpers/formatDate';
import { MaterialIcons, Feather } from '@expo/vector-icons'; 

const { width, height } = Dimensions.get('screen');

export default function Homepage() {
  const { msg } = useLocalSearchParams();
  const [imagesUri, setImagesUri] = useState([]);
  const [pdfFilesInfo, setPdfFilesInfo] = useState([]);
  const [showMsg, setShowMsg] = useState(msg || '');
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(false);
  


  const pdfOptions = useRef(new Animated.Value(0)).current;
  const [pdfMenuVisible, setPdfMenuVisible] = useState(false);
  
//intial fetch data
  useEffect(() => {
   const getPermission =async()=>{
    if(Platform.Version<30){
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      const readGranted = granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
      const writeGranted = granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
    }
   }
    const fetchData = async () => {
      const hasPermission = await getPermission();
      if (!hasPermission&&Platform.Version<30) {
        await getPermission()
      }else{
        console.log('no need for permission for android 11+')
      }

      const pdfFiles = await getPdfFiles();
      const result = await getImageFiles();
      setPdfFilesInfo(pdfFiles);
      setImagesUri(result);
    };
    fetchData();
    
  }, []);

  useEffect(() => {
    if (showMsg) {
      const timer = setTimeout(() => setShowMsg(null), 3000);
      return () => {

        clearTimeout(timer);
      };
    }
  }, [showMsg]);

  const togglePdfMenu = (uri) => {
    setPdfUri(uri);
    setPdfMenuVisible(true);
    Animated.timing(pdfOptions, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const pdfActionMenu = () => {
    Animated.timing(pdfOptions, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start(() => setPdfMenuVisible(false));
  };

  const pdfMenuHandler = async (item) => {
    setLoading(true);
    switch (item) {
      case 'Open':
        router.push({ pathname: 'renderPdf', params: { image: pdfUri } });
        break;
      case 'Share':
        await sharePdf(pdfUri);
        break;
      case 'Delete':
        await deletePdf(pdfUri);
       ToastAndroid.show('PDF deleted successfully!',ToastAndroid.LONG)
     router.replace('/')
  
        break;
      case 'Rename':
  renamePdf(pdfUri)       
        break;
      default:
        break;
    }
    pdfActionMenu();
    setLoading(false);
  };

  const menuItems = [
    { label: 'Open', icon: 'open-in-new' },
    { label: 'Share', icon: 'share' },
    { label: 'Delete', icon: 'delete' },
    { label: 'Rename', icon: 'edit' },
    
  ];

  return (
    <Provider store={store}>
      <TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <Navbar />

          {showMsg ? <Text style={styles.successMessage}>{showMsg}</Text> : null}

          <ScrollView contentContainerStyle={styles.pdfListContainer}>
            {pdfFilesInfo.length > 0 ? (
              pdfFilesInfo.map((pdf, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={() => togglePdfMenu(pdf.name)} style={styles.pdfItem}>
                    <Image source={{ uri: `file://${imagesUri[index]}` }} style={styles.pdfThumbnail} />
                    <View style={styles.pdfDetailsContainer}>
                      <Text style={styles.pdfTitle}>
                        {pdf.name}
                      </Text>
                      <Text style={styles.pdfSize}>{(pdf.size / (1024 * 1024)).toFixed(2)} MB</Text>
                      <Text style={styles.pdfDate}>{formatDate(pdf.modificationDate)}</Text>
                      <Text style={styles.pdfPath}>{pdf.path.replace('/storage/emulated/0/','')}</Text>
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

          {pdfMenuVisible && (
            <TouchableWithoutFeedback onPress={pdfActionMenu}>
              <Animated.View style={[styles.menuOverlay, { height: pdfOptions }]}>
                <View style={styles.animatedMenu}>
                  {menuItems.map((item, idx) => (
                    <TouchableOpacity key={idx} onPress={() => pdfMenuHandler(item.label)} style={styles.menuItem}>
                      <MaterialIcons name={item.icon} size={24} color="#6200EE" style={styles.menuIcon} />
                      <Text style={styles.menuOption}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6200EE" />
              <Text style={styles.loadingText}>Processing...</Text>
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
    height: height,
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
    zIndex: 2000,
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
  footerWrapper: {
    height: height * 0.1,
  },
  menuOverlay: {
    position: 'absolute',
    width: width,
    justifyContent: 'flex-end',
    bottom: 0,
  },
  animatedMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuOption: {
    fontSize: 16,
    color: '#333',
  },
  loadingOverlay: {
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
