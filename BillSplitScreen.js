import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View, TouchableOpacity
} from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { getMemberModel, resetMemberModel } from './MemberModel';
import { getItemModel, resetItemModel } from './ItemModel';
import { getBillsExportHTML } from './exportTemplate';

export default function BillSplitScreen({navigation, route}){
  const email = route.params.email;
  const group = route.params.group;
  const memberModel = getMemberModel(group);
  const itemModel = getItemModel(group.groupId);
  const [memberList, setMemberList] = useState([]);
  const [itemList, setItemList] = useState([]);

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html: getBillsExportHTML(group)
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }


  useEffect(()=>{
    const memberListenerId = memberModel.addListener(() => {
      setMemberList(memberModel.getMemberList());
    });
    const itemListenerId = itemModel.addListener(() => {
      setItemList(itemModel.itemList);
    });

    return () => {
      memberModel.removeListener(memberListenerId);
      itemModel.removeListener(itemListenerId);
  };}, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={()=>{
            resetMemberModel();
            resetItemModel();
            navigation.goBack();
          }}/>

        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}> {group.name} Bills</Text>
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
      <Text style={containerStyles.paragraph}>
        Item List
      </Text>
      <Button title='Add item !' onPress={()=>{
        navigation.navigate("ItemScreen", {group: group});
      }}/>
      <View style={listStyles.userListContainer}>
        <FlatList
        data={itemList}
        renderItem={({item}) => {
          return (
          <TouchableOpacity style={listStyles.groupItem} onPress={()=>{
            navigation.navigate("DetailScreen", {email: email, item: item});
          }}>
            <Text>
              Item Name: {item.name}
            </Text>
            <Text>
              Item Value: {item.value}
            </Text>
            <Text>
              Item Payer: {item.payer}
            </Text>
          </TouchableOpacity>
          );
        }}
        />
      </View>
      <View style={{alignItems: 'center', marginBottom: 30}}>
        <Ionicons 
            name="share-outline" size={30} color="#007DC9"
            onPress={()=>{
              printToFile();
            }}
            />
      </View>
    </View>
    );
}
