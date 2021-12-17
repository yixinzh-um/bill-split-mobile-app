import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, View, TouchableOpacity
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { headerStyles, containerStyles, listStyles, rowStyles} from './globalStyles';
import { Ionicons } from '@expo/vector-icons'; 
import { getMemberModel, resetMemberModel } from './MemberModel';
import { getItemModel, resetItemModel } from './ItemModel';
import { getBillsExportHTML } from './exportTemplate';
import { ButtonStyles } from './globalStyles'

export default function BillSplitScreen({navigation, route}) {
  const email = route.params.email;
  const group = route.params.group;
  const memberModel = getMemberModel(group);
  const itemModel = getItemModel(group.groupId);
  const [memberList, setMemberList] = useState([]);
  const [itemList, setItemList] = useState([]);

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const html = getBillsExportHTML(group);
    const { uri } = await Print.printToFileAsync({
      html
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }


  useEffect(() => {
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
          onPress={() => {
            resetMemberModel();
            resetItemModel();
            navigation.goBack();
          }}/>

        <View style={{flex: 1}}>
          <Text style={headerStyles.title}>Bills</Text>
        </View>
        <Ionicons
          name="share-outline" size={30} color="black"
          onPress={() => {
            printToFile();
          }}/>
        
      </View>
      <Text style={containerStyles.paragraph}>
        Welcome to group {group.name}
      </Text>

      <Button 
        title={'Balance'}
        containerStyle={listStyles.shadow}
        buttonStyle={{backgroundColor: '#888DA7'}}
        onPress = {() => {
          navigation.navigate("BalanceScreen", {group: group,
                                                memberList: memberList});
      }}/>
      

      <Text style={containerStyles.paragraph}>
        Item List
      </Text>

      <View style={[listStyles.userListContainer, listStyles.shadow]}>
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
            <Ionicons
              style={headerStyles.rightIcon}
              name="chevron-forward-outline" size={30} color="#303633"
            />

          </TouchableOpacity>
          );
        }}
        />
      </View>
      <Button
        title='Add item'
        buttonStyle={{backgroundColor: '#F29559'}}
        icon={
          <Ionicons
            name="add-circle-outline"
            size={25}
            color="white"
          />
        }
        iconRight
        onPress={() => {
        navigation.navigate("ItemScreen", {group: group});
      }}/>
    </View>
    );
}
