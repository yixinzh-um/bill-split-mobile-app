import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel, resetUserModel } from "./UserModel"
import { getAuth, signOut } from "firebase/auth";
import { getGroupList, resetGroupList } from "./GroupList";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';
import { headerStyles, rowStyles, containerStyles, listStyles } from './globalStyles'

const userModel = getUserModel();
const auth = getAuth();
const groupList = getGroupList();

export default function HomeScreen({navigation, route}){
  const email = route.params.email;
  const userModel = getUserModel();
  const currentUser = userModel.getUser(email);

  console.log("currentUser");
  console.log(currentUser);
  const [userName, setUserName] = useState("");
  const [groups, setGroups] = useState([]);
  React.useEffect(() => { 
    const focus = navigation.addListener('focus', async () => {
      userModel.addSubscribers(()=>{setUserName(userModel.userInfo[email].userName);});
      groupList.addSubscribers(()=>{setGroups(groupList.getGroupList());});
      await userModel.updateUserName(email, userName);
      await groupList.load(email);
      return () => {resetGroupList(); resetUserModel();};
    });
    return focus;
  }, [navigation]);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="settings-outline" size={30} color="black"
          onPress={()=>{
            navigation.navigate("UserProfileScreen", {user: currentUser});
          }}/>

        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}>{userName}'s Groups</Text>
        </View>
        <View style={{flex: 0.1}}>
          <Ionicons 
            name="search-outline" size={30} color="black"
            onPress={()=>{
              setIsVisible(true);
            }}/>
        </View>
      </View>
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Name: </Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={userName}
            onChangeText={(text)=>setUserName(text)}
          />
        </View>
        <Button styles={rowStyles.buttonContainer} title='Set New Name' onPress={
          ()=>{userModel.updateUserName(email, userName);}
        }/>
      </View>
      <Button title='Create Group' onPress={()=>{
        navigation.navigate("CreateGroupScreen", {email: email});
      }}/>
      <View style={listStyles.userListContainer}>
          <FlatList
          data={groups}
          renderItem={({item}) => {
            return (
            <View style={listStyles.groupItem}>
              <Text>
                Name: {item.name} 
              </Text>
              <Text>
                Purpose: {item.purpose}
              </Text>
              <Text>
                Creator: {item.creator}
              </Text>
              <Button title='Enter !' onPress={()=>{
                navigation.navigate("BillSplitScreen", {email: email, groupId: item.groupId});
              }}/>
            </View>
            );
          }}
          />
      </View>
    </View>
    );
}
