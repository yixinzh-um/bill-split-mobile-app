import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { getMemberModel } from './MemberModel';
import { getItemModel } from './ItemModel';



// {payer: 'pandapcd@umich.edu', groupId: 'BBmfhqvfJv262w5XBJau', name: 'test', value: 123, key: 0, …}
// groupId: "BBmfhqvfJv262w5XBJau"
// id: "v7uQRfieoWtlIn6hPov8"
// key: 0
// name: "test"
// payer: "pandapcd@umich.edu"
// value: 123
// [[Prototype]]: Object

export default function DetailScreen({navigation, route}){
  const email = route.params.email;
  const item = route.params.item
  const itemModel = getItemModel(item.groupId);
  const [itemName, setItemName] = useState(item.name);
  const [itemValue, setItemValue] = useState(item.value);
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
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          {item.payer==email ?
          <TextInput 
            style={rowStyles.inputBox}
            value={itemName}
            onChangeText={(text)=>{setItemName(text);}}
          />
          :
          <Text>{itemName}</Text> }
        </View>
      </View>
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Value:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          {item.payer==email ?
          <TextInput 
            style={rowStyles.inputBox}
            value={itemValue}
            onChangeText={(text)=>{setItemValue(text);}}
          />
          :
          <Text>{itemValue}</Text> }
        </View>
      </View>
      {item.payer==email ?
        <View>
          <Button title='Update item !' onPress={()=>{
            itemModel.updateItem(item, itemName, itemValue);
            navigation.goBack();
          }}/>
          <Button title='Delete item !' onPress={()=>{
            itemModel.deleteItem(item);
            navigation.goBack();
          }}/>
        </View>
        : <Text>Item Payer: {item.payer}</Text>
      }
    </View>
    );
}
