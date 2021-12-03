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

  const [groups, setGroups] = useState([]);
  useEffect(() => { 
    const focus = navigation.addListener('focus', async () => {
      groupList.addSubscribers(()=>{setGroups(groupList.getGroupList());});
      await groupList.load(email);
      return () => {resetGroupList(); resetUserModel();};
    });
    return focus;
  }, [navigation]);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="settings-outline" size={30} color="black"
          onPress={()=>{
            navigation.navigate("UserProfileScreen", {user: currentUser});
          }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>{currentUser != null ? currentUser.userName : "User"}'s Groups</Text>
        </View>
        
        <Ionicons 
          style={headerStyles.rightIcon}
          name="search-outline" size={30} color="black"
          onPress={()=>{
          }}/>
      
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
