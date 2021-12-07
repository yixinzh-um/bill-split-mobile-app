import React, { useEffect, useState } from 'react';
import { 
  FlatList, Modal, StyleSheet, Button, Alert,Text, TextInput, View,
} from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import { getGroupUserList } from "./GroupModel";
import { getAuth } from "firebase/auth";
import { Ionicons, MaterialIcons, AntDesign  } from '@expo/vector-icons'; 
import { headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles} from './globalStyles';
import { getUserModel } from './UserModel';

export default function CreateGroupScreen({navigation, route}){
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
    console.log('useEffect');
    groupUserList.addSubscribers(()=>{setUserList(groupUserList.getUserList());});
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
      console.log(newUser.contacts);
      console.log(bottomListContents);
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
          onPress={()=>{
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
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Group Name:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={groupName}
            onChangeText={(text)=>{setGroupName(text);}}
            />
        </View>
      </View>
      <View style={rowStyles.row}>
          <View style={rowStyles.labelContainer}>
            <Text style={rowStyles.labelText}>Purpose:</Text>
          </View>
          <View style={rowStyles.inputContainer}>
            <TextInput 
              style={rowStyles.inputBox}
              value={purpose}
              onChangeText={(text)=>{setPurpose(text);}}
            />
          </View>
      </View>
      <View style={rowStyles.row}>
        <View style={rowStyles.labelContainer}>
          <Text style={rowStyles.labelText}>Memembers:</Text>
        </View>
        <View style={rowStyles.inputContainer}>
          <TextInput 
            style={rowStyles.inputBox}
            value={userEmail}
            onChangeText={(text)=>{setUserEmail(text);}}
            />
        </View>
        <Button style={rowStyles.buttonContainer}
          title='Add a new contact'
          icon={<MaterialIcons name="Add" size={24} color="darkgrey"/>}
          type="clear"
          onPress={()=>{
            if (userEmail.indexOf("@")<1) {
              alert("Invalid Email");
            } else {
              groupUserList.addUser(userEmail);
              userModel.addContact(userEmail);
              setUserEmail('');
            }
          }}/>
      </View>
      <Ionicons 
        name="add-circle-outline" size={24} color="#007DC9"
        onPress={()=>{
          setIsVisible(true);
        }}
        />
      <View style={listStyles.userListContainer}>
        <FlatList
        data={userList}
        renderItem={({item}) => {
          return (
          <View style={listStyles.groupItem}>
            <Text>
              {item.email}
            </Text>
            <Button
              title='Delete user'
              icon={<MaterialIcons name="delete" size={24} color="darkgrey"/>}
              type="clear"
              onPress={()=>{
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
