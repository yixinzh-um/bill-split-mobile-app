import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, View, TouchableOpacity
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { getUserModel } from "./UserModel";
import { getGroupList} from "./GroupModel";
import { getAuth } from "firebase/auth";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { headerStyles, containerStyles, listStyles } from './globalStyles';

const auth = getAuth();

export default function HomeScreen({navigation, route}) {
  const email = route.params.email;
  const userModel = getUserModel(email);
  const groupList = getGroupList(email);
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userListenerId = userModel.addListener(async () => {
      const userModel = await getUserModel(email);
      const newUser = userModel.getCurrentUser();
      setUserName(newUser.name);
    });
    const groupListenerId = groupList.addListener(
      () => {setGroups(groupList.getGroupList());}
    );

    return () => {
      userModel.removeListener(userListenerId);
      groupList.removeListener(groupListenerId);
    };
  }, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="settings-outline" size={30} color="black"
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

      <View style={listStyles.userListContainer}>
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
        <Button title='Create Group'
          style={listStyles.button}
          buttonStyle={{backgroundColor: '#F29559'}}
          onPress={() => {
            navigation.navigate("CreateGroupScreen", {email: email});
          }}/>
      </View>
    </View>
    );
}
