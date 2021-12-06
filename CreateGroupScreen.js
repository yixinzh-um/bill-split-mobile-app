import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getGroupUserList, resetGroupUserList } from "./GroupUserList";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
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
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            navigation.goBack();
          }}/>
        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}>Create group</Text>
        </View>
        <View style={{flex: 0.1}}>
          <Ionicons 
            name="create-outline" size={30} color="black"
            onPress={()=>{
            }}/>
        </View>
      </View>
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Group Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={groupName}
            onChangeText={(text)=>{setGroupName(text);}}
            />
        </View>
      </View>
      <View style={rowStyles.row}>
          <View style={rowStyles.labelContainer}>
            <Text style={rowStyles.labelText}>Purpose:</Text>
          </View>
          <View style={rowStyles.inputContainer}>
            <TextInput 
            style={rowStyles.inputBox}
            value={purpose}
            onChangeText={(text)=>{setPurpose(text);}}
            />
          </View>
      </View>
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Email:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={userEmail}
            onChangeText={(text)=>{setUserEmail(text);}}
            />
        </View>
        <Button style={rowStyles.buttonContainer}
          title='Add user'
          icon={<MaterialIcons name="Add" size={24} color="darkgrey"/>}
          type="clear"
          onPress={()=>{
            groupUserList.addUser(userEmail);
          }}/>
      </View>
      <View style={listStyles.userListContainer}>
        <FlatList
        data={userList}
        renderItem={({item}) => {
          return (
          <View style={listStyles.groupItem}>
            <Text>
              {item.email}
            </Text>
            <Button
              title='Delete user'
              icon={<MaterialIcons name="delete" size={24} color="darkgrey"/>}
              type="clear"
              onPress={()=>{
                groupUserList.deleteUser(item.email);
              }}/>
          </View>
          );
        }}
        />
      </View>
      <Button title='Create !' onPress={()=>{
        groupUserList.upload(email, groupName, purpose);
        navigation.goBack();
      }}/>
    </View>
    );
}
