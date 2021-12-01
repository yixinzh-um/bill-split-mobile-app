import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel } from "../models/UserModel"

const userModel = getUserModel();

function HomeScreen({navigation}){
    return (
        <View style={styles.container}>
          <Text style={styles.paragraph}>
            Change code in the editor and watch it change on your phone! Save to get a shareable url.
          </Text>
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