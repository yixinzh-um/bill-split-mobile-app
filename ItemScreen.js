import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { getMemberModel } from './MemberModel';
import { getItemModel } from './ItemModel';

export default function ItemScreen({navigation, route}){
  const group = route.params.group;
  const memberModel = getMemberModel(group);
  const itemModel = getItemModel(group.groupId);

  const [itemValue, setItemValue] = useState(0);
  const [itemName, setItemName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [itemList, setItemList] = useState([]);

  useEffect(()=>{
    const itemListenerId = itemModel.addListener(() => {
      setItemList(itemModel.itemList);
    });
    
    // const memberListenerId

    return () => {
      itemModel.removeListener(itemListenerId);
  };}, []);


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
          <TextInput 
            style={rowStyles.inputBox}
            value={itemName}
            onChangeText={(text)=>{setItemName(text);}}
            />
        </View>
      </View>
      <View style={rowStyles.row}>
          <View style={rowStyles.labelContainer}>
            <Text style={rowStyles.labelText}>Item Value:</Text>
          </View>
          <View style={rowStyles.inputContainer}>
            <TextInput 
              style={rowStyles.inputBox}
              value={itemValue}
              onChangeText={(text)=>{setItemValue(text);}}
            />
          </View>
      </View>
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Payer Email:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={payerEmail}
            onChangeText={(text)=>{setPayerEmail(text);}}
            />
        </View>
        <Button style={rowStyles.buttonContainer}
          title='Add Item'
          icon={<MaterialIcons name="Add" size={24} color="darkgrey"/>}
          type="clear"
          onPress={()=>{
            // const value = parseFloat(parseFloat(itemValue).toFixed(2));
            const value=5;
            if(!(value>0)){
              alert("The item value should be a number larger than 0");
              setItemValue(0);
            }
            // else if(payerEmail.indexOf("@")<1)alert("Invalid Email");
            // else if(memberModel.members[payerEmail]==undefined)alert("The user is not in the group");
            // else if(itemName=="")alert("The item name can't be blank")
            else {
              setItemValue(value);
              // itemModel.addItem(itemName, itemValue, payerEmail);
              // memberModel.addItem(itemValue, payerEmail);
              memberModel.addItem(10, payerEmail);
              navigation.goBack();
            }
          }}/>
      </View>
      {/* <View style={listStyles.userListContainer}>
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
      </View> */}
    </View>
    );
}
