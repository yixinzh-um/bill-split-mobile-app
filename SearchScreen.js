import React, { useEffect, useState } from 'react';
import { 
  FlatList, Button, Text, TextInput, View, TouchableOpacity
} from 'react-native';
import { headerStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { Ionicons } from '@expo/vector-icons'; 
import { getItemModels, resetItemModels } from './ItemModel';
import { getGroupList } from './GroupModel';

export default function SearchScreen({navigation, route}) {
  const email = route.params.email;
  const groups = getGroupList(email).getGroupList();
  const itemModels = getItemModels(groups);
  const [itemList, setItemList] = useState([]);
  const [inputvalue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {    
    const itemListenerIds = itemModels.map(item => item.addListener(
      () => setItemList(itemList.concat(item.itemList))
    ));

    return () => {
      for (let i = 0; i < itemModels.length; i++) {
          itemModels[i].removeListener(itemListenerIds[i]);
      }
    };}, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            resetItemModels();
            navigation.goBack();
          }}/>

        <View style={{flex: 1}}>
          <Text style={headerStyles.title}>Search Items</Text>
        </View>
      </View>

      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Keyword:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={inputvalue}
            onChangeText={(text) => {setInputValue(text)}}
            />
        </View>
        <Button style={rowStyles.buttonContainer}
          title='Search'
          onPress={() => {
            setKeyword(inputvalue.trim().toLowerCase());
          }}/>
      </View>
 
      <Text style={containerStyles.paragraph}>
        Results
      </Text>
      {keyword!='' && (itemList.filter(item => item.name.toLowerCase().includes(keyword)).length > 0 ?
        <View style={listStyles.userListContainer}>
          <FlatList
            data={itemList.filter(item => item.name.toLowerCase().includes(keyword))}
            renderItem={({item}) => {
              return (
              <TouchableOpacity style={listStyles.groupItem} onPress={() => {
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
        </View>:
        <Text style={containerStyles.paragraph}>No results</Text>)
        }
    </View>
    );
}
