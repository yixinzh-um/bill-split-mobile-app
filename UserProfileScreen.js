import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View, TouchableOpacity
} from 'react-native';
import { getGroupUserList, resetGroupUserList } from "./GroupUserList";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { headerStyles, detailStyles, buttonStyles} from './globalStyles'

const auth = getAuth();

export default function UserProfileScreen({navigation, route}){
  const user = route.params.user;

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            navigation.goBack();
          }}/>

        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}>Profile</Text>
        </View>
        <View style={{flex: 0.1}}>
          <Ionicons 
            name="create-outline" size={30} color="black"
            onPress={()=>{
            }}/>
        </View>
      </View>

      <View style={styles.row}>
        <View style={detailStyles.row}>
          <View style={detailStyles.labelContainer}>
            <Text style={detailStyles.labelText}>Name:</Text>
          </View>
          <View style={detailStyles.valueContainer}>
            <Text style={detailStyles.valueText}>{user.userName}</Text>
          </View>
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
    backgroundColor: '#ecf0f1',
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