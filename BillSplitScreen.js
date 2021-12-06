import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { getItemModel } from "./UserModel"
import { getAuth, signOut } from "firebase/auth";
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles} from './globalStyles';
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 

export default function BillSplitScreen({navigation, route}){
  const email = route.params.email;
  const group = route.params.group;

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
    </View>
    );
}
