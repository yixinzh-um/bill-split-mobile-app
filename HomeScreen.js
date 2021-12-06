import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel, resetUserModel } from "./UserModel"
import { getGroupList} from "./GroupModel";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';
import { headerStyles, rowStyles, containerStyles, listStyles } from './globalStyles'

const auth = getAuth();

export default function HomeScreen({navigation, route}){
  const email = route.params.email;
  const userModel = getUserModel(email);
  const groupList = getGroupList(email);
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userListenerId = userModel.addListener(async () => {
      const userModel = await getUserModel(email);
      const newUser = userModel.getCurrentUser();
      setUserName(newUser.name);
    });
    const groupListenerId = groupList.addListener(
      () => {setGroups(groupList.getGroupList());}
    );

    return () => {
      userModel.removeListener(userListenerId);
      groupList.removeListener(groupListenerId);
    };
  }, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="settings-outline" size={30} color="black"
          onPress={()=>{
            navigation.navigate("UserProfileScreen", {email: email});
        }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>{userName}'s Groups</Text>
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
                  navigation.navigate("BillSplitScreen", {email: email, group: item});
                }}/>
              </View>
            );
        }}
      />
      </View>
    </View>
    );
}
