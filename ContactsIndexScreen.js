import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel } from "./UserModel"
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';
import { headerStyles, rowStyles, containerStyles, listStyles, detailStyles } from './globalStyles'

const userModel = getUserModel();
const auth = getAuth();

export default function ContactsIndexScreen({navigation, route}){
  const email = route.params.email;
  const userModel = getUserModel();
  const user = userModel.getCurrentUser();
  const [contact, setContact] = useState('');
  const [contacts, setContacts] = useState(user.contacts);

  useEffect(() => {
    const listenerId =  userModel.addListener(() => {
      let newUser = userModel.getCurrentUser();
      setContacts(newUser.contacts);
    });
    return(() => {
      userModel.removeListener(listenerId);
    })
  }, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            navigation.navigate("UserProfileScreen", {email: email});
          }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>Contacts</Text>
        </View>
        
        <Ionicons 
          style={headerStyles.rightIcon}
          name="search-outline" size={30} color="black"
          onPress={()=>{
          }}/>
      
      </View>
      <View style={detailStyles.inputContainer}>
        <TextInput style={detailStyles.inputBox}
                    value={contact}
                    onChangeText={(text)=>{setContact(text)}}
          />
      </View>
      <Button title='Add a new contact' onPress={()=>{
        userModel.addContact(contact);
        setContact('');
      }}/>
      <View style={listStyles.userListContainer}>
          <FlatList
          data={contacts}
          renderItem={({item}) => {
            return (
            <View style={listStyles.groupItem}>
              <Text>
                {item} 
              </Text>
              <Ionicons 
                style={headerStyles.rightIcon}
                name="trash-outline" size={25} color="black"
                onPress={()=>{
                  userModel.removeContact(item);
                }}/>
              {/* <Text>
                Purpose: {item.purpose}
              </Text>
              <Text>
                Creator: {item.creator}
              </Text> */}
              {/* <Button title='Enter !' onPress={()=>{
                navigation.navigate("BillSplitScreen", {email: email, group: item});
              }}/> */}
            </View>
            );
          }}
          />
      </View>
    </View>
    );
}
