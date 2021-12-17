import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, View, TouchableOpacity
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import update from 'immutability-helper';
import * as Notifications from 'expo-notifications';
import { getItemModels, resetItemModels } from './ItemModel';
import { getUserModel } from "./UserModel";
import { getGroupList} from "./GroupModel";
import { getAuth } from "firebase/auth";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { headerStyles, containerStyles, listStyles } from './globalStyles';

const auth = getAuth();

export default function HomeScreen({navigation, route}) {
  const email = route.params.email;
  const user = getUserModel(email).getCurrentUser();
  const groupList = getGroupList(email);
  const [groups, setGroups] = useState(groupList.getGroupList());
  const itemModels = getItemModels(groups);
  const [ hasPermission, setHasPermission ] = useState(false);
  let debtMap = {};
  for (const group of groups) {
    debtMap[group.groupId] = [group.name, 0];
  }
  const [debt, setDebt] = useState(debtMap);

  useEffect(() => {
    const groupListenerId = groupList.addListener(
      () => {setGroups(groupList.getGroupList());}
    );

    async function getPermissions(){
      const { status } = await Notifications.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    }
    async function scheduleNotification() {
      let message = [];
      for (const key in debt) {
        if (debt[key][1] !== 0)
          message.push(`${debt[key][0]}: ${debt[key][1]}`);
      }
      message = message.join('\n');
      console.log(debt);
      await Notifications.cancelAllScheduledNotificationsAsync();
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Your bills in these groups aren't balanced",
          body: `${message}`,
        },
        trigger: {
          seconds: 5
        }
/*         trigger: {
          day: date,
          hour: 9,
          repeats: true
        } */
      })
    }
    let itemListenerIds;
    function loopItemList(itemList, itemModel) {
      for (const item of itemList) {
        if (item.payer === email) {
          setDebt(oldMap => update(oldMap, {[itemModel.groupId]: {1:
            {$set: oldMap[itemModel.groupId][1] - item.value}}}));
        } else {
          setDebt(oldMap => update(oldMap, {[itemModel.groupId]: {1:
            {$set: oldMap[itemModel.groupId][1] + item.value}}}));
        }
      }
    }
    if (user.acceptNotification) {
      for (const itemModel of itemModels){
        loopItemList(itemModel.itemList, itemModel);
      }
      itemListenerIds = itemModels.map(itemModel => itemModel.addListener(
        () => {
          loopItemList(itemModel.itemList, itemModel);
        }
      ));
      getPermissions();
      scheduleNotification();
      setDebt(debtMap);
    }

    return () => {
      groupList.removeListener(groupListenerId);
      if (itemListenerIds){
        for (let i = 0; i < itemModels.length; i++) {
          itemModels[i].removeListener(itemListenerIds[i]);
        }
      }
    };
  }, []);

/*   if (user.acceptNotification && !hasPermission) {
    return (
      <View>
        <Text>Notification permissions not granted.</Text>
      </View>
    );
  } */

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="person-circle-outline" size={33} color="black"
          onPress={() => {
            navigation.navigate("UserProfileScreen", {email: email});
        }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>Groups</Text>
        </View>
        
        <Ionicons
          style={headerStyles.rightIcon}
          name="search-outline" size={30} color="black"
          onPress={() => {
            navigation.navigate("SearchScreen", {email: email});
          }}/>
      
      </View>

      <View style={[listStyles.userListContainer, listStyles.shaodow]}>
        <FlatList
          data={groups}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={listStyles.groupItem}
                onPress={() => {
                  navigation.navigate("BillSplitScreen", {email: email, group: item});
                }}
                >

                <Avatar
                  rounded
                  title={item.name}
                  backgroundColor='#888DA7'
                  avatarStyle={{borderWidth:5, borderColor: 'white'}}
                  titleStyle={{fontSize: 15}}
                  size={70}
                  />

                <View style={listStyles.groupItemContent}>
                  <Text>
                    Creator: {item.creator}
                  </Text>
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

      <View style={listStyles.button}>
        <Button
          title='Create Group'
          style={listStyles.button}
          buttonStyle={{backgroundColor: '#F29559'}}
          onPress={() => {
            navigation.navigate("CreateGroupScreen", {email: email});
          }}/>
      </View>
    </View>
    );
}
