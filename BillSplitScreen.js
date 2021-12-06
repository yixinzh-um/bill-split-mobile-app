import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { getMemberModel } from './MemberModel';

export default function BillSplitScreen({navigation, route}){
  const email = route.params.email;
  const group = route.params.group;
  const memberModel = getMemberModel(group);
  const [memberList, setMemberList] = useState([]);

  useEffect(()=>{
    const memberListenerId = memberModel.addListener(() => {
      setMemberList(memberModel.getMemberList());
    });
    
    return () => {
      memberModel.removeListener(memberListenerId);
      // groupList.removeListener(groupListenerId);
  };}, []);


  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            navigation.goBack();
          }}/>

        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}> Bills</Text>
        </View>
        <View style={{flex: 0.1}}>
          <Ionicons 
            name="settings-outline" size={30} color="black"
            onPress={()=>{
            }}/>
        </View>
      </View>
      <Text style={containerStyles.paragraph}>
        Welcome to group {group.name}
      </Text>
      <View style={listStyles.userListContainer}>
        <FlatList
        data={memberList}
        renderItem={({item}) => {
          return (
          <View style={listStyles.groupItem}>
            <Text>
              {item.email}
            </Text>
            <Text>
              Balance: {item.balance}
            </Text>
          </View>
          );
        }}
        />
      </View>
      <Button title='Add item !' onPress={()=>{
        // if(groupName=="")alert("Group can't have an empty name!")
        // else{
        //   groupUserList.upload(email, groupName, purpose);
        //   navigation.goBack();
        // }
      }}/>
    </View>
    );
}
