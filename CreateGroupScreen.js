import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getGroupUserList, resetGroupUserList } from "./GroupUserList";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons'; 
const auth = getAuth();

export default function CreateGroupScreen({navigation, route}){
    const email = route.params.email;
    const [groupName, setGroupName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const groupUserList = getGroupUserList();
    const [userList, setUserList] = useState([]);

    useEffect(()=>{
        groupUserList.addSubscribers(()=>{setUserList(groupUserList.getUserList());});
        return resetGroupUserList;
    },[]);

    return (
        <View style={styles.container}>
            <View style={styles.loginRow}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Group Name:</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.inputBox}
                        value={groupName}
                        onChangeText={(text)=>{setGroupName(text);}}
                        />
                </View>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Purpose:</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                    style={styles.inputBox}
                    value={purpose}
                    onChangeText={(text)=>{setPurpose(text);}}
                    />
                </View>
            </View>
            <View style={styles.userListContainer}>
                <View style={styles.userList}>
                    <FlatList
                    data={userList}
                    renderItem={({item}) => {
                        return (
                        <View style={styles.userItem}>
                            <Text>
                                {item.email}
                            </Text>
                            <Ionicons
                                name="trash-outline" size={24} color="black"
                                onPress={()=>{
                                    groupUserList.deleteUser(item.email);
                                }}/>
                        </View>
                        );
                    }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>Email:</Text>
                    </View>
                    <TextInput 
                        style={styles.inputBox}
                        value={userEmail}
                        onChangeText={(text)=>{setUserEmail(text);}}
                        />
                    <Ionicons
                        name="add-circle-outline" size={24} color="black"
                        onPress={()=>{
                            groupUserList.addUser(userEmail);
                        }}/>
                        
                </View>
            </View>
            <Button title="Create" onPress={()=>{
                    groupUserList.upload(email, groupName, purpose);
                    navigation.navigate("HomeScreen", {email: email});
                }}/>
            
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
        flex:0.3,
        alignItems: 'center',
        width: '100%',
    },
    labelContainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    labelText: {
        fontSize: 18
    },
    inputContainer: {
        flex: 1,
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
    sectionHeader: {
        width: '100%',
        padding: '3%',
        justifyContent: 'center',
        alignItems: 'center'
      },
    sectionHeaderText: {
        fontSize: 36
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