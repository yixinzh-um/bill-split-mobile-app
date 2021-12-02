import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel } from "./UserModel"
import { getAuth, signOut } from "firebase/auth";

export default function BillSplitScreen({navigation, route}){
    const email = route.params.email;
    const groupId = route.params.groupId;

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                Welcome to group {groupId}
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
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    labelContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    labelText: {
        fontSize: 18
    },
    inputContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%'
    },
    inputBox: {
        width: '100%',
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 18,
        padding: '2%'
    },
    userListContainer: {
        flex: 0.3, 
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', 
    },
    userList: {
        flex:0.7,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        flex: 1,
    }
  });