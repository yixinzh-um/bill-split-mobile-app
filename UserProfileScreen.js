import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, TextInput, View, TouchableOpacity, Switch
} from 'react-native';
import { Button } from 'react-native-elements';
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons'; 
import { headerStyles, detailStyles, buttonStyles, rowStyles} from './globalStyles';
import { getUserModel, resetUserModel } from "./UserModel";
import * as Notifications from 'expo-notifications';

const auth = getAuth();

export default function UserProfileScreen({navigation, route}) {
  const email = route.params.email;
  const userModel = getUserModel(email);
  const user = userModel.getCurrentUser();
  const [mode, setMode] = useState('show');
  const [name, setName] = useState(user.name);
  const [accept, setAccept] = useState(user.accpetNotification);

  useEffect(() => {
    const listenerId =  userModel.addListener(() => {
      let newUser = userModel.getCurrentUser();
      setName(newUser.name);
    });
    return(() => {
      userModel.removeListener(listenerId);
    })
  }, [mode]);
  
  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            navigation.goBack();
          }}/>

        <View style={headerStyles.titleContainer}>
          <Text style={headerStyles.title}>Profile</Text>
        </View>
        {mode == "edit" ? 
          <Ionicons
            style={headerStyles.rightIcon}
            name="checkmark-outline" size={30} color="black"
            onPress={() => {
              setMode("show");
              userModel.updateUserName(name);
            }}/>
          :
          <View></View>
        }

      </View>

      <View style={styles.row}>
        <View style={detailStyles.row}>
          <View style={detailStyles.labelContainer}>
            <Text style={detailStyles.labelText}>Name:</Text>
          </View>
          
            {mode == "show" ?
            <View style={detailStyles.editorContainer}>
              <View style={detailStyles.valueContainer}>
                <Text style={detailStyles.valueText}>{name}</Text>
              </View>
              <Ionicons
                name="create-outline" size={25} color="black"
                onPress={() => {
                  setMode("edit");
                }}/>
            </View>      
            :
            <View style={detailStyles.inputContainer}>
              <TextInput style={detailStyles.inputBox}
                         value={name}
                         onChangeText={(text) => {setName(text);}}
                />
            </View>
            }
           
          </View>
        
        <View style={detailStyles.row}>
          <View style={detailStyles.labelContainer}>
            <Text style={detailStyles.labelText}>Email:</Text>
          </View>
          <View style={detailStyles.valueContainer}>
            <Text style={detailStyles.valueText}>{userModel.email}</Text>
          </View>
        </View>
      </View>

      <View style={detailStyles.row}>
          <View style={detailStyles.labelContainer}>
            <Text style={detailStyles.labelText}>Contacts:</Text>
          </View>
          <View style={detailStyles.valueContainer}>
            <Ionicons
              name="people-circle-outline" size={30} color="#E66713"
              onPress={() => {
                navigation.navigate("ContactsIndexScreen", {email: email});
              }}/>
          </View>
        </View>

        <View style={styles.signOutContainer}>
          <View style={rowStyles.rowContent}>
            <View style={rowStyles.labelContainer}>
              <Text style={rowStyles.labelText}>Receive monthly debt notifications:</Text>
            </View>
            <View style={rowStyles.inputContainer}>
              <Switch  
                value={accept}
                onValueChange={(value) => { 
                  setAccept(value);
                  if (!value) 
                    Notifications.cancelAllScheduledNotificationsAsync();
                  userModel.updateNotification(value);
                }}/>
            </View>
          </View>
        </View>
      
        <View style={styles.signOutContainer}>
          <Button
            buttonStyle={{backgroundColor: '#F29559'}}
            title="Summary"
            onPress={()=>navigation.navigate("SummaryScreen", { email: email})}
            />
        </View>

      <View style={styles.signOutContainer}>
        <TouchableOpacity 
          style={buttonStyles.container}
          onPress={() => {
            signOut(auth);
            console.log("sign out");
            resetUserModel();
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }}
          >
          <Text style={buttonStyles.text}>Log out</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 8,
  },
  row: {
    flex: 0.6,
    width: '100%',
  },
  signOutContainer: {
    flex: 0.2,
    alignItems: 'center',
  }
});