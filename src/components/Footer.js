import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Options from "./Options";
import { useSelector,useDispatch } from "react-redux";
import { Visible } from "../redux/store";

const Footer = () => {
  const isVisible=useSelector((state)=>state.visibility.value)
  const dispatch=useDispatch()
   
    return (
        <View style={styles.footerContainer}>
            {isVisible?<Options/>:<TouchableOpacity onPress={()=>dispatch(Visible())}>
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
        left:'45%'

    },
    icon: {
        fontSize: 50,

    }
})

export default Footer