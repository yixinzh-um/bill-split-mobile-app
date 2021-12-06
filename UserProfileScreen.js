import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View, TouchableOpacity
} from 'react-native';
import { getGroupUserList, resetGroupUserList } from "./GroupUserList";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { headerStyles, detailStyles, buttonStyles} from './globalStyles'
import { getUserModel, resetUserModel } from "./UserModel"

const auth = getAuth();

export default function UserProfileScreen({navigation, route}){
  const email = route.params.email;
  const userModel = getUserModel();
  const user = userModel.getUser(email);
  console.log(user);
  const [mode, setMode] = useState('show');
  const [userName, setUserName] = useState();

  useEffect(() => {
    const listenerId =  userModel.addUserListener(() => {
      let newUser = userModel.getUser(email);
      setUserName(newUser.userName);
    });
    return(() => {
      userModel.removeUserListener(listenerId);
    })
  }, [mode]);
  
  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Ionicons 
          style={headerStyles.leftIcon}
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            navigation.goBack();
          }}/>

        <View style={headerStyles.titleContainer}>
          <Text style={headerStyles.title}>Profile</Text>
        </View>
        {mode == "edit" ? 
          <Ionicons 
            style={headerStyles.rightIcon}
            name="checkmark-outline" size={30} color="black"
            onPress={()=>{
              setMode("show");
              userModel.updateUserName(user.email, userName);
            }}/>
          :
          <View></View>
        }

      </View>

      <View style={styles.row}>
        <View style={detailStyles.row}>
          <View style={detailStyles.labelContainer}>
            <Text style={detailStyles.labelText}>Name:</Text>
          </View>
          
            {mode == "show" ?
            <View style={detailStyles.editorContainer}>
              <View style={detailStyles.valueContainer}>
                <Text style={detailStyles.valueText}>{userName}</Text>
              </View>
              <Ionicons 
                name="create-outline" size={25} color="black"
                onPress={()=>{
                  setMode("edit");
                }}/>
            </View>      
            :
            <View style={detailStyles.inputContainer}>
              <TextInput style={detailStyles.inputBox}
                         value={userName}
                         onChangeText={(text)=>{setUserName(text);}}
                />
            </View>
            }
           
          </View>
        
        <View style={detailStyles.row}>
          <View style={detailStyles.labelContainer}>
            <Text style={detailStyles.labelText}>Email:</Text>
          </View>
          <View style={detailStyles.valueContainer}>
            <Text style={detailStyles.valueText}>{user.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.signOutContainer}>
        <TouchableOpacity 
          style={buttonStyles.container}
          onPress={() => {
            signOut(auth);
            console.log("sign out");
            navigation.navigate("LoginScreen");
          }}
          >
          <Text style={buttonStyles.text}>Log out</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 8,
  },
  row: {
    flex: 0.5,
    width: '100%',
  },
  signOutContainer: {
    flex: 0.2,
    alignItems: 'center',
  }
});