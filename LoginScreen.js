import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Alert, Text, TextInput, View, TouchableOpacity,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { ButtonStyles } from './globalStyles'

import { getDB } from "./FirebaseApp";
import { getUserModel } from './UserModel';

const auth = getAuth();

export default function LoginScreen({navigation}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user)navigation.navigate('HomeScreen', {email: user.email});
    })
  }, []);

  return (
    <View style={styles.container}>      
      <View style={styles.loginContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            Sprucebook
          </Text>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <Input
              style={styles.loginInputBox}
              placeholder='enter email address'
              autoCapitalize='none'
              spellCheck={false}
              value={email}
              onChangeText={(text) => {setEmail(text)}}
              />
          </View>
        </View>
    
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <Input
              style={styles.loginInputBox}
              placeholder='enter password'
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {setPassword(text)}}
              />
          </View>
        </View>
    
        <View style={styles.loginButtonRow}>
          <Button
            buttonStyle={{backgroundColor: '#F29559'}}
            title={mode === 'login'?'Log in':'Sign up'}
            onPress={async () => { 
              if (mode === 'login') {
                try {
                  await signInWithEmailAndPassword(auth, email, password);
                  console.log('logged in user', email);
                } catch(error) {
                  console.log("Sign Up Error", error.message, [{ text: "OK" }]);
                  Alert.alert("Log in Error", error.message, [{ text: "OK" }]);
                }
              } 
              else {
                try {
                  await createUserWithEmailAndPassword(auth, email, password);
                  await getUserModel(email);
                  console.log('created user', email);
                } catch(error) {
                  console.log("Sign Up Error", error.message, [{ text: "OK" }]);
                  Alert.alert("Sign Up Error", error.message, [{ text: "OK" }]);
                }
              }
              setEmail('');
              setPassword('');
          }}/>
        </View>

        <View style={styles.modeSwitchContainer}>
          {mode === 'login' ?
            <Text>New user?
            <Text
              onPress={() => {setMode('signup')}}
              style={{color: '#E66713'}}> Sign up </Text>
            instead!</Text>
          :
            <Text>Existing user?
            <Text
            onPress={() => {setMode('login')}}
            style={{color: '#E66713'}}> Log In </Text>
            instead!</Text>}
        </View>
        <View style={ButtonStyles.buttonContainer}>
          <Button
            title='Guest'
            buttonStyle={{backgroundColor:'#303633'}}
            onPress={()=>navigation.navigate("GuestScreen")}
          />
        </View>
      </View>
    </View>
  );
}
  

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#ffffff',
  alignItems: 'center',
  justifyContent: 'center',
},

loginContainer: {
  flex: 0.2,
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '100%',
  paddingTop: '50%',
  // paddingBottom: '10%'
},
loginRow: {
  flexDirection: 'row',
  paddingBottom: '5%',
  paddingHorizontal: '10%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
},
loginLabelContainer: {
  flex: 0.4,
  justifyContent: 'center',
  alignItems: 'flex-start'
},
loginLabelText: {
  fontSize: 18
},
loginInputContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-end',
  width: '100%'
},
loginInputBox: {
  width: '80%',
  borderColor: 'lightgray',
  borderWidth: 1,
  borderRadius: 6,
  fontSize: 18,
  padding: '5%'
},
modeSwitchContainer:{
  marginTop: '10%',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
},
loginButtonRow: {
  width: '100%',
  justifyContent: 'center', 
  alignItems: 'center'
},

sectionHeader: {
  width: '100%',
  padding: '10%',
  justifyContent: 'center',
  alignItems: 'center'
},
sectionHeaderText: {
  fontSize: 36,
  fontWeight: 'bold',
},
listContainer: {
  flex: 0.7, 
  backgroundColor: '#ccc',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%', 
},

guestContainer: {
  // marginTop: '10%',
  paddingTop: '10%',
  width: '80%',
  alignItems: 'center',
  borderTopColor: '#E1E1E1',
  borderTopWidth: 1,
},

guestButton: {
  alignItems: 'center',
  backgroundColor: '#E1E1E1',
  borderRadius: 10,
  padding: 10,
},

guestText: {
  fontSize: 20
},
});
