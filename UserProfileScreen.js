import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getGroupUserList, resetGroupUserList } from "./GroupUserList";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import headerStyles from './headerStyles'

const auth = getAuth();

export default function UserProfileScreen({navigation, route}){
//   const email = route.params.email;
//   const [groupName, setGroupName] = useState("");
//   const [purpose, setPurpose] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const groupUserList = getGroupUserList();
//   const [userList, setUserList] = useState([]);

//   useEffect(()=>{
//     groupUserList.addSubscribers(()=>{setUserList(groupUserList.getUserList());});
//     return ()=>{resetGroupUserList()};
//   },[]);

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            navigation.navigate("UserProfileScreen", {email: email});
          }}/>

        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}>Hi, {userName}</Text>
        </View>
        <View style={{flex: 0.1}}>
          <Ionicons 
            name="search-outline" size={30} color="black"
            onPress={()=>{
              setIsVisible(true);
            }}/>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={styles.labelText}>Name:</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textValue}>Group 1</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Purpose:</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textValue}>Purpose 1</Text>
        </View>
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
  row: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  labelContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'flex-end'
  },
  textValue: {

  }
  // labelText: {
  //   fontSize: 18
  // },
  // inputContainer: {
  //   flex: 0.6,
  //   justifyContent: 'center',
  //   alignItems: 'flex-start',
  //   width: '100%'
  // },
  // inputBox: {
  //   width: '100%',
  //   borderColor: 'lightgray',
  //   borderWidth: 1,
  //   borderRadius: 6,
  //   fontSize: 18,
  //   padding: '2%'
  // },
  // sectionHeader: {
  //   width: '100%',
  //   padding: '3%',
  //   justifyContent: 'center',
  //   alignItems: 'center'
  //   },
  // sectionHeaderText: {
  //   fontSize: 36
  // },
  // userListContainer: {
  //   flex: 0.7, 
  //   backgroundColor: '#ccc',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   width: '100%', 
  // },
  });