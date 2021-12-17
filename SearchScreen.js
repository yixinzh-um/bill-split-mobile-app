import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, View, TouchableOpacity
} from 'react-native';
import { Button, Input, Avatar } from 'react-native-elements';
import { headerStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { Ionicons } from '@expo/vector-icons'; 
import { getItemModels, resetItemModels } from './ItemModel';
import { getGroupList } from './GroupModel';

export default function SearchScreen({navigation, route}) {
  const email = route.params.email;
  const groups = getGroupList(email).getGroupList();
  const itemModels = getItemModels(groups);
  let initItemList = [];
  for (const itemModel of itemModels) {
    initItemList = initItemList.concat(itemModel.itemList);
  }
  const [itemList, setItemList] = useState(initItemList);
  const [inputvalue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {    
    const itemListenerIds = itemModels.map(item => item.addListener(
      () => {setItemList(itemList.concat(item.itemList));}
    ));

    return () => {
      for (let i = 0; i < itemModels.length; i++) {
          itemModels[i].removeListener(itemListenerIds[i]);
      }
    }}, []);

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

      <View style={[rowStyles.rowContainer, {flex: 0.2}]}>
        <View style={[rowStyles.inputContainer,{flex: 1}]}>
          <Input
            style={rowStyles.inputBox}
            value={inputvalue}
            placeholder={'keyword'}
            onChangeText={(text) => {setInputValue(text)}}
            />
        </View>
        <Button
          buttonStyle={{backgroundColor: '#F29559'}}
          title='Search'
          onPress={() => {
            setKeyword(inputvalue.trim().toLowerCase());
          }}/>
      </View>
 
      <Text style={containerStyles.paragraph}>
        Results
      </Text>
      {keyword!='' && (itemList.filter(item => item.name.toLowerCase().includes(keyword)).length > 0 ?
        <View style={[listStyles.userListContainer, listStyles.shaodow]}>
        <FlatList
        data={itemList}
        renderItem={({item}) => {
          return (
          <TouchableOpacity style={listStyles.groupItem} onPress={() => {
            navigation.navigate("DetailScreen", {email: email, item: item});
          }}>
          <Avatar
            title={item.name}
            backgroundColor='#888DA7'
            avatarStyle={{borderWidth:5, borderColor: 'white'}}
            titleStyle={{fontSize: 15}}
            size={70}
            />
            <View stye={rowStyles.rowContainer}>
              <View style={[rowStyles.rowContent, {paddingVertical: 0}]}>
                <Text>
                  Value:
                </Text>
                <Text>
                  {item.value}
                </Text>
              </View>
              <View style={[rowStyles.rowContent, {paddingVertical: 0}]}>
                <Text >
                  Payer:
                </Text>
                <Text>
                  {item.payer}
                </Text>
              </View>
            </View>
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
