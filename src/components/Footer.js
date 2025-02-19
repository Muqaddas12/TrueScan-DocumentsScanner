import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { launchGallery } from "../helpers/FooterHelper";
import Options from "./Options";
import { store, Visible } from "../redux/store";
store.subscribe()
const Footer = () => {
    const [isVisible,setVisible]=useState(false)
   
    return (
        <View style={styles.footerContainer}>
            {isVisible?<Options/>:<TouchableOpacity onPress={()=>store.dispatch(Visible())}>
                <Icon
                    style={styles.icon}
                    name="plus" />
            </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 50,
        borderColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',

    },
    icon: {
        fontSize: 50,

    }
})

export default Footer