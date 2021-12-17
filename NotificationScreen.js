import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons'; 
import update from 'immutability-helper';
import { getGroupList } from './GroupModel';
import { getItemModels, resetItemModels } from './ItemModel';
import { headerStyles, containerStyles, rowStyles } from './globalStyles';

export default function NotificationScreen({navigation, route}) {
  const [ hasPermission, setHasPermission ] = useState(false);
  const email = route.params.email;
  const groups = getGroupList(email).getGroupList();
  const itemModels = getItemModels(groups);
  const [date, setDate] = useState(1);
  let debtMap = {};
  for (const group of groups) {
    debtMap[group.groupId] = [group.name, 0];
  }
  const [debt, setDebt] = useState(debtMap);

  useEffect(() => {
    const itemListenerIds = itemModels.map(itemModel => itemModel.addListener(
      () => {
        for (const item of itemModel.itemList) {
          if (item.payer === email) {
            setDebt(oldMap => update(oldMap, {[itemModel.groupId]: {1:
              {$set: oldMap[itemModel.groupId][1] - item.value}}}));
          } else {
            setDebt(oldMap => update(oldMap, {[itemModel.groupId]: {1:
              {$set: oldMap[itemModel.groupId][1] + item.value}}}));
          }
        }
      }
    ));
    
    async function getPermissions(){
      const { status } = await Notifications.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    }
    getPermissions();

    return () => {
      for (let i = 0; i < itemModels.length; i++) {
        itemModels[i].removeListener(itemListenerIds[i]);
      }
    };
  }, []); 


  if (!hasPermission) {
    return (
      <View>
        <Text>Notification permissions not granted.</Text>
      </View>
    );
  }

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            resetItemModels();
            navigation.goBack();
          }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>Notification Scheduler</Text>
        </View>
      </View>

      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Date to receive notifications each month:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput
            style={rowStyles.inputBox}
            value={date.toString()}
            onChangeText={(text) => {setDate(text)}}
          />
        </View>
      </View>

      <Button
        title='Schedule notification'
        onPress={() => {
          let message = [];
          for (const key in debt) {
            if (debt[key][1] !== 0)
              message.push(`${debt[key][0]}: ${debt[key][1]}`);
          }
          message = message.join('\n');
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Your bills in these groups aren't balanced",
              body: `${message}`,
            },
            trigger: {
              day: date,
              hour: 9,
              repeats: true
            }
          })
          resetItemModels();
          navigation.goBack();
      }}/>
    </View>
  );
}
