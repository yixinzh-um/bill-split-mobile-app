import React, { useEffect, useState } from 'react';
import { 
  FlatList, Text, TextInput, View,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { getUserModel } from "./UserModel"
import { Ionicons } from '@expo/vector-icons'; 
import { headerStyles, containerStyles, listStyles, rowStyles } from './globalStyles'

export default function ContactsIndexScreen({navigation, route}) {
  const email = route.params.email;
  const userModel = getUserModel(email);
  const user = userModel.getCurrentUser();
  const [contact, setContact] = useState('');
  const [contacts, setContacts] = useState(user.contacts);

  useEffect(() => {
    const listenerId =  userModel.addListener(() => {
      let newUser = userModel.getCurrentUser();
      setContacts(newUser.contacts);
    });
    return(() => {
      userModel.removeListener(listenerId);
    })
  }, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            navigation.navigate("UserProfileScreen", {email: email});
          }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>Contacts</Text>
        </View>
      </View>
      <Button
          buttonStyle={{backgroundColor: '#F29559'}}
          title='Add a new contact' onPress={() => {
          userModel.addContact(contact);
          setContact('');
        }}/>
      <View style={listStyles.addContainer}>
        <View style={listStyles.inputContainer}>
          <Input
            style={listStyles.inputBox}
            placeholder={'New Contact Email'}
            value={contact}
            onChangeText={(text) => {setContact(text)}}
            />
        </View>
      </View>
      <View style={listStyles.userListContainer}>
          <FlatList
          data={contacts}
          keyExtractor={(item, index) => item}
          renderItem={({item}) => {
            return (
            <View style={[listStyles.balanceItem, {justifyContent: 'center'}]}>
              <Text>
                {item} 
              </Text>
              <Ionicons
                style={headerStyles.rightIcon}
                name="trash-outline" size={25} color="black"
                onPress={() => {
                  userModel.removeContact(item);
                }}/>
            </View>
            );
          }}
          />
      </View>
    </View>
    );
}
