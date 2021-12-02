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
      <View style={styles.row}>
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
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Email:</Text>
          </View>
          <TextInput 
            style={styles.inputBox}
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
          navigation.navigate("HomeScreen", {email: email});
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
  row: {
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