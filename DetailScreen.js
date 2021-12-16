import React, { useEffect, useState } from 'react';
import { 
  Button, Text, TextInput, View, Image, TouchableOpacity
} from 'react-native';
import { headerStyles, detailStyles, rowStyles, containerStyles} from './globalStyles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { getItemModel } from './ItemModel';

export default function DetailScreen({navigation, route}) {
  const email = route.params.email;
  const item = route.params.item;
  const expoPushToken = route.params.expoPushToken;
  const itemModel = getItemModel(item.groupId);
  const [itemName, setItemName] = useState(item.name);
  const [itemValue, setItemValue] = useState(item.value.toString());
  const [image, setImage] = useState({uri: item.image});

  useEffect(() => {
    const itemListenerId = itemModel.addListener(() => {
      if (itemModel.image!=undefined) {
        setImage(itemModel.image);
      }
      console.log(itemModel.image);
    });

    return () => {
      itemModel.removeListener(itemListenerId);
  };}, []);
  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            itemModel.image = undefined;
            navigation.goBack();
          }}/>

        <View style={{flex: 1}}>
          <Text style={headerStyles.title}> Edit items</Text>
        </View>
      </View>
      <View style={rowStyles.rowContainer}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          {item.payer == email ?
          <TextInput 
            style={rowStyles.inputBox}
            value={itemName}
            onChangeText={(text) => {setItemName(text);}}
          />
          :
          <Text style={rowStyles.labelText}>{itemName}</Text> }
        </View>
      </View>
      <View style={rowStyles.rowContainer}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Value:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          {item.payer == email ?
          <TextInput 
            style={rowStyles.inputBox}
            value={itemValue}
            onChangeText={(text) => {setItemValue(text);}}
          />
          :
          <Text style={rowStyles.labelText}>{itemValue}</Text> }
        </View>
      {item.payer == email ?
        <TouchableOpacity onPress={() => {navigation.navigate('CameraScreen', {"group": item.groupId})}}>
          <MaterialIcons name='photo-camera'size={32}/>
        </TouchableOpacity>
        :
        <View></View>
      }
      </View>
      {image === undefined ? <View></View> : 
        <View>
          <Image
            style={detailStyles.mainImage}
            source={image}
          />
        </View>
      }
      {item.payer == email ?
        <View>
          <Button
            title='Update item !'
            onPress={() => {
            const value = parseFloat(parseFloat(itemValue).toFixed(2));
            if (!(value > 0)) {
              alert("The item value should be a number larger than 0");
              setItemValue('0');
            }
            else if (itemName == "")alert("The item name can't be blank")
            else{
              setItemValue(value.toString());
              itemModel.updateItem(item, 
                                   itemName, 
                                   parseFloat(parseFloat(itemValue).toFixed(2)));
              navigation.goBack();
            }            
          }}/>
          <Button
            title='Delete item !'
            onPress={() => {
              const message = {
                to: expoPushToken,
                sound: 'default',
                title: 'Your group has made a payment!',
                body: `Item ${itemName} has been payed`
              };
              sendPushNotification(message);
              itemModel.deleteItem(item);
              itemModel.image = undefined;
              navigation.goBack();
          }}/>
        </View>
        :  <View style={rowStyles.rowContainer}>
             <View style={rowStyles.labelContainer}>
              <Text style={rowStyles.labelText}>Item Payer:</Text>
            </View>
            <View style={rowStyles.inputContainer}>
              <Text style={rowStyles.labelText}>{item.payer}</Text>
            </View>
          </View>
      }
    </View>
    );
}

async function sendPushNotification(message) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}