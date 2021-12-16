import React, { useEffect, useState } from 'react';
import { 
  Button, Text, TextInput, View, Image, TouchableOpacity
} from 'react-native';
import { headerStyles, detailStyles, rowStyles, containerStyles} from './globalStyles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { getGuestModel } from "./GuestModel";

export default function DetailScreen({navigation, route}) {
  const item = route.params.item;
  const guestModel = getGuestModel();
  const [itemName, setItemName] = useState(item.name);
  const [itemValue, setItemValue] = useState(item.value.toString());
  const [image, setImage] = useState(item.image);
  console.log(image);
  useEffect(() => {
    const itemListenerId = guestModel.addListener(() => {
      if (guestModel.image!=undefined) {
        setImage(guestModel.image);
      }
    });

    return () => {
      guestModel.removeListener(itemListenerId);
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
          <Text style={headerStyles.title}> Edit items</Text>
        </View>
      </View>
      <View style={rowStyles.rowContainer}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={itemName}
            onChangeText={(text) => {setItemName(text);}}
          />
        </View>
      </View>
      <View style={rowStyles.rowContainer}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Value:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={itemValue}
            onChangeText={(text) => {setItemValue(text);}}
          />
        </View>
      <TouchableOpacity onPress={() => {navigation.navigate('GuestCameraScreen')}}>
        <MaterialIcons name='photo-camera'size={32}/>
      </TouchableOpacity>
      </View>
      {image === undefined ? <View></View> : 
        <View>
          <Image
            style={detailStyles.mainImage}
            source={image}
          />
        </View>
      }
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
              guestModel.updateItem(item.key,
                                    itemName,
                                    parseFloat(parseFloat(itemValue).toFixed(2)));
              navigation.goBack();
            }
          }}/>
          <Button
            title='Delete item !'
            onPress={() => {
              guestModel.deleteItem(item.key);
              guestModel.image = undefined;
              navigation.goBack();
          }}/>
      </View>
    </View>
    );
}
