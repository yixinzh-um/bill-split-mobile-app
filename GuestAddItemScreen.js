import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { BottomSheet, ListItem, Input, Button } from 'react-native-elements';
import { headerStyles, rowStyles, containerStyles, detailStyles } from './globalStyles';
import { Ionicons, MaterialIcons  } from '@expo/vector-icons'; 
import { getGuestModel} from "./GuestModel";
export default function GuestAddItemScreen({navigation, route}) {

  const guestModel = getGuestModel();
  const [itemValue, setItemValue] = useState('0');
  const [itemName, setItemName] = useState("");
  const [payerName, setPayerName] = useState("");
  const [image, setImage] = useState(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [userList, setUserList] = useState(guestModel.getUserList());
  const bottomList = [
    {
      title: 'Settings',
      containerStyle: { backgroundColor: 'black' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
      hasIcon: true,
    },
  ];
  for (let member of userList) {
    let content = {
      title: member.name,
      isSelected: false,
      onPress: () => {
        setPayerName(member.name);
      }
    }
    bottomList.push(content);
  }
  useEffect(() => {
    const guestListenerId = guestModel.addListener(() => {
      setUserList(guestModel.getUserList());
      setImage(guestModel.image);
    });
    return () => {
      guestModel.removeListener(guestListenerId);
  };}, []);


  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            guestModel.image = undefined;
            navigation.goBack();
          }}/>

        <View style={{flex: 1}}>
          <Text style={headerStyles.title}> Add Items</Text>
        </View>
      </View>
      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <Input
            style={rowStyles.inputBox}
            value={itemName}
            onChangeText={(text) => {setItemName(text);}}
            />
        </View>
      </View>
      <View style={rowStyles.rowContent}>
          <View style={rowStyles.labelContainer}>
            <Text style={rowStyles.labelText}>Item Value:</Text>
          </View>
          <View style={rowStyles.inputContainer}>
            <Input
              style={rowStyles.inputBox}
              value={itemValue}
              onChangeText={(text) => {setItemValue(text)}}
            />
          </View>
      </View>
      <View style={rowStyles.rowContainer}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Payer Name:</Text>
        </View>
        <Ionicons
          name="add-circle-outline" size={24} color="#007DC9"
          onPress={() => {
            setIsVisible(true);
          }}
          />
        <View style={rowStyles.inputContainer}>
          <Text style={rowStyles.inputlabelText}>{payerName}</Text>
        </View>
      </View>
      {image == undefined ? <View></View> 
        :
        <Image
          style={detailStyles.mainImage}
          source={image}
        />
      }
      <TouchableOpacity style={rowStyles.center}
        onPress={() => {navigation.navigate('GuestCameraScreen')}}>
        <MaterialIcons name='photo-camera'size={32}/>
      </TouchableOpacity>
      <Button
        style={rowStyles.buttonContainer}
        title='Add Item'
        type="clear"
        onPress={() => {
          const value = parseFloat(parseFloat(itemValue).toFixed(2));
          if (!(value > 0)) {
            alert("The item value should be a number larger than 0");
            setItemValue('0');
          }
          else if (guestModel.users[payerName]==undefined)alert("The user is not in the group");
          else if (itemName == "")alert("The item name can't be blank")
          else {
            setItemValue(value.toString());
            guestModel.addItem(itemName, parseFloat(parseFloat(itemValue).toFixed(2)), payerName);
            navigation.goBack();
          }
        }}/>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
        {bottomList.map((l, i) => (
          <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
            <ListItem.Content style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ListItem.Title style={l.titleStyle}><Text>{l.title}</Text></ListItem.Title>
              {l.hasIcon &&
                <Ionicons
                  name="close-circle-outline" size={24} color="#007DC9"/>
              }
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
    );
}
