import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getDataModel } from "./DataModel"
import { getAuth, signOut } from "firebase/auth";

const dataModel = getDataModel();
const auth = getAuth();

export default function HomeScreen({navigation, route}){
    console.log(route.params.email);
    console.log(route.params);
    return (
        <View style={styles.container}>
          <Text style={styles.paragraph}>
            Change code in the editor and watch it change on your phone! Save to get a shareable url.
          </Text>
          <Button title='Sign Out' onPress={
              ()=>{
                    signOut(auth)
                    console.log("sign out");
                    navigation.goBack();
              }
            }/>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    paragraph: {
      margin: 24,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });