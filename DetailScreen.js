import React, { useEffect, useState } from 'react';
import { 
  Text, TextInput, View, Image, TouchableOpacity
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { headerStyles, detailStyles, rowStyles, containerStyles} from './globalStyles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { getItemModel } from './ItemModel';

export default function DetailScreen({navigation, route}) {
  const email = route.params.email;
  const item = route.params.item;
  console.log(item);
  console.log(email);
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
        {item.payer == email ?
        <View style={{flex: 1}}>
            <Text style={headerStyles.title}> Edit items</Text>
        </View>
        :
        <View style={{flex: 1}}>
          <Text style={headerStyles.title}>{item.name}</Text>
        </View>
        }
        {item.payer == email ?
        <View style={{flex: 0.1}}>
          <Ionicons
            name="checkmark-outline" size={30} color="black"
            type="clear"
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
        </View>
        :
        <View></View>
        }
      </View>
      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          {item.payer == email ?
          <Input
            style={rowStyles.inputBox}
            value={itemName}
            onChangeText={(text) => {setItemName(text);}}
          />
          :
          <Text style={rowStyles.labelText}>{itemName}</Text> }
        </View>
      </View>
      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Value:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          {item.payer == email ?
          <Input
            style={rowStyles.inputBox}
            value={itemValue}
            onChangeText={(text) => {setItemValue(text);}}
          />
          :
          <Text style={rowStyles.labelText}>{itemValue}</Text> }
        </View>
      </View>
      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Item Payer:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <Text style={rowStyles.labelText}>{item.payer}</Text>
        </View>
      </View>
      {item.payer == email ?
        <TouchableOpacity
          style={rowStyles.rowContainer}
          onPress={() => {navigation.navigate('CameraScreen', {"group": item.groupId})}}>
          <MaterialIcons name='photo-camera'size={32}/>
        </TouchableOpacity>
        :
        <View></View>
      }
      {image === undefined ? <View></View> : 
        <View style={{alignItems: 'center'}}>
          <Image
            style={detailStyles.mainImage}
            source={image}
          />
        </View>
      }
      {item.payer == email ?
        <View>
          <Button
            title='Delete item'
            buttonStyle={{backgroundColor:'#303633'}}
            onPress={() => {
              itemModel.deleteItem(item);
              itemModel.image = undefined;
              navigation.goBack();
          }}/>
        </View>
:
<View></View>
      }
    </View>
    );
}
