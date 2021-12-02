import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getUserModel } from "./UserModel"
import { getAuth, signOut } from "firebase/auth";
import { getGroupList, resetGroupList } from "./GroupList";

const userModel = getUserModel();
const auth = getAuth();
const groupList = getGroupList();

export default function HomeScreen({navigation, route}){
  const email = route.params.email;
  const [userName, setUserName] = useState(
    userModel.userInfo[email]==undefined ? undefined : userModel.userInfo[email]["userName"]
  );
  const [groups, setGroups] = useState([]);

  useEffect(async ()=>{
    userModel.updateUserName(email, userName);
    groupList.addSubscribers(()=>{setGroups(groupList.getGroupList());});
    await groupList.load(email);
    console.log(groups);
    return resetGroupList;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Email: {email}
      </Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Name: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
          style={styles.loginInputBox}
          value={userName==undefined?email:userName}
          onChangeText={(text)=>{setUserName(text);}}
          />
        </View>
      </View>
      <Button title='Sign Out' onPress={
        ()=>{
            signOut(auth);
            console.log("sign out");
            navigation.goBack();
        }
        }/>
      <Button title='Create Group' onPress={()=>{
        navigation.navigate("CreateGroupScreen", {email: email});
      }}/>
      <View style={styles.userListContainer}>
        <View style={styles.userList}>
          <FlatList
          data={groups}
          renderItem={({item}) => {
            return (
            <View style={styles.userItem}>
              <Text>
                Name: {item.name} 
              </Text>
              <Text>
                Purpose: {item.purpose}
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
    flexDirection: 'row',
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
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex: 1,
  }
  });