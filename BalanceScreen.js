import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList
} from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons'; 
import { headerStyles, listStyles} from './globalStyles'
import { getMemberModel, resetMemberModel } from './MemberModel';

const auth = getAuth();

export default function BalanceScreen({navigation, route}) {
  // const email = route.params.email;
  const group = route.params.group;
  const memberModel = getMemberModel(group);
  const [memberList, setMemberList] = useState([]);
  console.log(memberList);

  useEffect(() => {
    const memberListenerId = memberModel.addListener(() => {
      setMemberList(memberModel.getMemberList());
    });

    return () => {
      memberModel.removeListener(memberListenerId);
  };}, []);
  
  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            navigation.goBack();
          }}/>
        <View style={{flex: 1}}>
          <Text style={headerStyles.title}>{group.name} Balane</Text>
        </View>        
      </View>
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