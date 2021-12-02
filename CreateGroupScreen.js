import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getGroupUserList, resetGroupUserList } from "./GroupUserList";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
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
        return ()=>{resetGroupUserList()};
    },[]);

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
            <View style={styles.userListContainer}>
                <FlatList
                data={userList}
                renderItem={({item}) => {
                    return (
                    <View>
                        <Text>
                            {item.email}
                        </Text>
                        <Button
                            icon={<MaterialIcons name="delete" size={24} color="darkgrey"/>}
                            type="clear"
                            onPress={()=>{
                                groupUserList.deleteUser(item.email);
                            }}/>
                    </View>
                    );
                }}
                />
                <View style={styles.loginInputContainer}>
                    <View style={styles.loginLabelContainer}>
                        <Text style={styles.loginLabelText}>Email:</Text>
                    </View>
                    <TextInput 
                        style={styles.loginInputBox}
                        value={userEmail}
                        onChangeText={(text)=>{setUserEmail(text);}}
                        />
                    <Button
                        icon={<MaterialIcons name="Add" size={24} color="darkgrey"/>}
                        type="clear"
                        onPress={()=>{
                            groupUserList.addUser(userEmail);
                        }}/>
                </View>
                <Button title='Create !' onPress={()=>{
                    groupUserList.upload(email, groupName, purpose);
                    navigation.goBack();
                }}/>
            </View>
            
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
        flex: 0.7, 
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', 
    },
  });