import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { headerStyles, listStyles} from './globalStyles'

export default function BalanceScreen({navigation, route}) {
  const { group, memberList } = route.params;
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
          <View style={listStyles.balanceItem}>
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