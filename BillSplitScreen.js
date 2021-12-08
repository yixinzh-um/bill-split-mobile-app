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

export default function BillSplitScreen({navigation, route}){
  const email = route.params.email;
  const group = route.params.group;
  const memberModel = getMemberModel(group);
  const itemModel = getItemModel(group.groupId);
  const [memberList, setMemberList] = useState([]);
  const [itemList, setItemList] = useState([]);

  let summaryTableBody = "";
  let detailTableBody = "";
  for (member of memberList) {
    let tr = `
      <tr>
        <td>${member.email} </td>
        <td>${member.balance}</td>
      </tr>
    `;
    summaryTableBody += tr;
  }
  for (item of itemList) {
    let tr = `
      <tr>
        <td>${item.name} </td>
        <td>${item.value}</td>
        <td>${item.payer}</td>
      </tr>
    `;
    detailTableBody += tr;
  }

  const html = `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      ${group.name} Bills
    </h1>
    <h2 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">
      Balance Summary
    </h2>
    <Table style="text-align:center; font-size: 20px; font-family: Helvetica Neue; font-weight: normal; margin: 0 auto;">
      <tr>
        <th>Email</th>
        <th>Balance</th>
      </tr>
      ${summaryTableBody}
    </Table>         
    <h2 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">Details</h2>
    <Table style="text-align:center; font-size: 20px; font-family: Helvetica Neue; font-weight: normal; margin: 0 auto;">
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Payer</th>
      </tr>
      ${detailTableBody}
    </Table> 
  </body>
</html>
  `;

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html
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
      <Ionicons 
          name="share-outline" size={24} color="#007DC9"
          onPress={()=>{
            printToFile();
          }}
          />
    </View>
    );
    return html;
}
