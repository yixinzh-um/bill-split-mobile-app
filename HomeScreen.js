import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel, resetUserModel } from "./UserModel"
import { getAuth, signOut } from "firebase/auth";
import { getGroupList, resetGroupList } from "./GroupList";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';
import { headerStyles } from './globalStyles'

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
    <View style={styles.container}>
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
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Name: </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.inputBox}
            value={userName}
            onChangeText={(text)=>setUserName(text)}
          />
        </View>
        <Button title='Set New Name' onPress={
          ()=>{userModel.updateUserName(email, userName);}
        }/>
      </View>
      <Button title='Create Group' onPress={()=>{
        navigation.navigate("CreateGroupScreen", {email: email});
      }}/>
      <View style={styles.userListContainer}>
        <View style={styles.userList}>
          <FlatList
          data={groups}
          renderItem={({item}) => {
            return (
            <View style={styles.groupItem}>
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
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    flexDirection: 'row',
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
  groupItem: {
    justifyContent: 'space-between',
    alignItems:'center',
    flex: 1,
  }
});
