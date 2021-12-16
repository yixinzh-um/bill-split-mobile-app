import React, { useEffect, useState, useRef } from 'react';
import { 
  FlatList, Text, View, TouchableOpacity
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { getUserModel } from "./UserModel";
import { getGroupList} from "./GroupModel";
import { getAuth } from "firebase/auth";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { headerStyles, containerStyles, listStyles } from './globalStyles';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const auth = getAuth();

export default function HomeScreen({navigation, route}) {
  const email = route.params.email;
  const userModel = getUserModel(email);
  const groupList = getGroupList(email);
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");

  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const userListenerId = userModel.addListener(async () => {
      const userModel = await getUserModel(email);
      const newUser = userModel.getCurrentUser();
      setUserName(newUser.name);
    });
    const groupListenerId = groupList.addListener(
      () => {setGroups(groupList.getGroupList());}
    );

    registerForPushNotificationsAsync().then(token => {console.log(token); setExpoPushToken(token)});

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      userModel.removeListener(userListenerId);
      groupList.removeListener(groupListenerId);
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
            navigation.navigate("SearchScreen", {email: email, expoPushToken: expoPushToken});
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
                  navigation.navigate("BillSplitScreen", {email: email, group: item, expoPushToken: expoPushToken});
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

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
