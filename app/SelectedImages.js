import react, { use, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

import { useLocalSearchParams } from "expo-router";
const SelectedImages = () => {
const result=JSON.parse(useLocalSearchParams().data)
const [images,setImages]=useState(result)

console.log(images[1])

    return (
        <View style={styles.container}>
            <View style={styles.imagesContainer}>
{images.map((res,index)=>(
   <View key={index}>
     <Image
     width={100} height={100} source={{uri:res.path}}/>
     <Text>{res.path}</Text>
   </View>
))}

            </View>
            {/* Footer */}
            <View style={styles.footerContainer}>
                <TouchableOpacity>
                    <Icon
                        style={styles.icon}
                        name="plus" />
                </TouchableOpacity>
                <View>
                    <Text>CreatePdf</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})


export default SelectedImages