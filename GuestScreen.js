import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, View, TouchableOpacity, TextInput
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { getGuestModel, resetGuestModel} from "./GuestModel";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { headerStyles, containerStyles, listStyles, ButtonStyles, rowStyles } from './globalStyles';

export default function HomeScreen({navigation, route}) {
  const guestModel = getGuestModel();
  const [userList, setUserList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [userName, setUserName] = useState("")
  const [userBalance, setUserBalance] = useState(0);


  useEffect(() => {
    const guestListenerId = guestModel.addListener(() => {
      setUserList(guestModel.getUserList());
      setItemList(guestModel.getItemList());
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
            resetGuestModel();
            navigation.goBack();
          }}/>
        <View style={{flex: 1}}>
          <Text style={headerStyles.title}>Guest Mode</Text>
        </View>
      </View>
      <Text style={headerStyles.subtitle}>User List</Text>
      <View style={rowStyles.rowContent}>
        <View style={listStyles.inputContainer}>
          <Text>User name: </Text>
          <TextInput 
            style={listStyles.inputBox}
            value={userName}
            onChangeText={(text) => {setUserName(text);}}
            />
        </View>
        <View style={listStyles.inputContainer}>
          <Text>User balance: </Text>
            <TextInput 
              style={listStyles.inputBox}
              value={userBalance}
              onChangeText={(text) => {setUserBalance(text);}}
              />
        </View>
      </View>
      <Button
        title='Add a new user'
        icon={<MaterialIcons name="Add" size={24} color="darkgrey"/>}
        type="clear"
        onPress={() => {
          const balance = parseFloat(parseFloat(userBalance).toFixed(2));
          if (balance<0) {
            alert("The user balance should be a number larger than 0");
            setUserBalance(0);
          }
          else if(guestModel.users[userName]!=undefined)alert("The user is already in the group");
          else if (userName == "")alert("The user name can't be blank")
          else {
            guestModel.addUser(userName, userBalance);
            setUserName("");
            setUserBalance(0);
          }
      }}/>
      <View style={listStyles.userListContainer}>
        <FlatList
        data={userList}
        renderItem={({item}) => {
          return (
          <View style={listStyles.groupItem}>
            <View stye={rowStyles.rowContainer}>
              <View style={[rowStyles.rowContent, {paddingVertical: 0}]}>
                <Text>
                  Name:
                </Text>
                <Text>
                  {item.name}
                </Text>
              </View>
              <View style={[rowStyles.rowContent, {paddingVertical: 0}]}>
                <Text >
                  Balance:
                </Text>
                <Text>
                  {item.balance}
                </Text>
              </View>
            </View>
            <Button
              title='Delete user'
              icon={<MaterialIcons name="delete" size={24} color="darkgrey"/>}
              type="clear"
              onPress={() => {guestModel.deleteUser(item.name);}}/>
          </View>
          );
        }}
        />
      </View>
      <Text style={headerStyles.subtitle}>
        Item List
      </Text>

      <View style={listStyles.userListContainer}>
        <FlatList
        data={itemList}
        renderItem={({item}) => {
          return (
          <TouchableOpacity style={listStyles.groupItem} onPress={() => {
            navigation.navigate("GuestDetailScreen", {item: item});
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
      </View>
      <Button
        title='Add item'
        buttonStyle={{backgroundColor: '#F29559'}}
        onPress={() => {
        navigation.navigate("GuestAddItemScreen");
      }}/>
    </View>
    );
}
