import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, TextInput, View,
} from 'react-native';
import { BottomSheet, ListItem, Input, Button} from 'react-native-elements';
import { getGroupUserList } from "./GroupModel";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { headerStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { getUserModel } from './UserModel';

export default function CreateGroupScreen({navigation, route}) {
  const email = route.params.email;
  const userModel = getUserModel();
  const [groupName, setGroupName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const groupUserList = getGroupUserList();
  const [userList, setUserList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [bottomList, setBottomList] = useState([]);
  const bottomListMenu = [
    {
      title: 'Settings',
      containerStyle: { backgroundColor: 'black' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
      hasIcon: true,
    },
  ];

  useEffect(() => {
    groupUserList.addSubscribers(() => {setUserList(groupUserList.getUserList());});
    const listenerId =  userModel.addListener(async () => {
      let newUser = await userModel.getCurrentUser();
      let bottomListContents = Array.from(bottomListMenu);
      for (let contact of newUser.contacts) {
        let contactItem = {
          title: contact,
          isSelected: false,
          onPress: () => {
            groupUserList.addUser(contact);
          }
        }
        bottomListContents.push(contactItem);
      }
      setBottomList(bottomListContents);
    });
    return(() => {
      userModel.removeListener(listenerId);
    })
  }, []);
  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            navigation.goBack();
          }}/>
        <View style={{flex: 0.9}}>
          <Text style={headerStyles.title}>Create group</Text>
        </View>
        <View style={{flex: 0.1}}>
          <Ionicons
            name="checkmark-outline" size={30} color="black"
            onPress={() => {
              if (groupName == "") {
                alert("Group can't have an empty name!")
              } else {
                groupUserList.upload(email, groupName, purpose);
                navigation.goBack();
              }
            }}/>
        </View>
      </View>
      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <Input
            style={rowStyles.inputBox}
            value={groupName}
            onChangeText={(text) => {setGroupName(text);}}
            />
        </View>
      </View>
      <View style={rowStyles.rowContent}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Members:</Text>
        </View>
        <Ionicons
        name="add-circle-outline" size={24} color="#007DC9"
        onPress={() => {
          setIsVisible(true);
        }}
        />
      </View>
      <View style={listStyles.addContainer}>
        <View style={listStyles.inputContainer}>
          <Input 
            style={rowStyles.inputBox}
            value={userEmail}
            onChangeText={(text) => {setUserEmail(text);}}
            />
        </View>
        <View style={listStyles.button}>
          <Button
            title='Add a new contact'
            style={listStyles.button}
            buttonStyle={{backgroundColor: '#F29559'}}
            onPress={() => {
              if (userEmail.indexOf("@")<1) {
                alert("Invalid Email");
              } else {
                groupUserList.addUser(userEmail);
                userModel.addContact(userEmail);
                setUserEmail('');
              }
            }}/>
        </View>
      </View>

      <View style={listStyles.userListContainer}>
        <FlatList
        data={userList}
        renderItem={({item}) => {
          return (
          <View style={listStyles.groupItem}>
            <Text>
              {item.email}
            </Text>
            <Ionicons
                style={headerStyles.rightIcon}
                name="trash-outline" size={25} color="black"
                onPress={() => {
                  groupUserList.deleteUser(item.email);
                }}/>
          </View>
          );
        }}
        />
      </View>

      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
       >
        {bottomList.map((l, i) => (
          <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
            <ListItem.Content style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ListItem.Title style={l.titleStyle}><Text>{l.title}</Text></ListItem.Title>
              {l.hasIcon &&
                <Ionicons
                  name="close-circle-outline" size={24} color="#007DC9"/>
              }
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>

    </View>
    );
}
