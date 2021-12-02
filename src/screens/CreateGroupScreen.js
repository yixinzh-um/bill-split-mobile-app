import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel } from "../models/UserModel"
import { getAuth, signOut } from "firebase/auth";
const userModel = getUserModel();
const auth = getAuth();

export default function CreateGroupScreen({navigation, route}){
    const email = route.params.email;
    const [groupName, setGroupName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [groupList, setGroupList] = useState([]);
    // useEffect(()=>{
    //     userModel.updateUserName(email, userName);
    // }, [userName]);

    return (
        <View style={styles.container}>
            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Group Name:</Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput 
                    style={styles.loginInputBox}
                    value={groupName}
                    onChangeText={(text)=>{setGroupName(text);}}
                    />
                </View>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Purpose:</Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput 
                    style={styles.loginInputBox}
                    value={purpose}
                    onChangeText={(text)=>{setPurpose(text);}}
                    />
                </View>
            </View>
            <Button title='Create Group' onPress={
                ()=>{}
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
    loginRow: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    loginLabelContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    loginLabelText: {
        fontSize: 18
    },
    loginInputContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%'
    },
    loginInputBox: {
        width: '100%',
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 18,
        padding: '2%'
    },
  });