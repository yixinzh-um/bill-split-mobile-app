import React, { useEffect, useState } from 'react';
import { 
    FlatList, Modal, StyleSheet, Button, Alert ,Text, TextInput, View,
} from 'react-native';
import { getDataModel } from "../models/DataModel";
import { getAuth, onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";

const auth = getAuth();
const dataModel = getDataModel();

export default function LoginScreen({navigation}){
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if(user)navigation.navigate('HomeScreen', {email: user.email});
        })
    }, []);

    return (
        <View style={styles.container}>      
        <View style={styles.loginContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                    Login:
                </Text>
            </View>
            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Email: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput 
                    style={styles.loginInputBox}
                    placeholder='enter email address' 
                    autoCapitalize='none'
                    spellCheck={false}
                    value={email}
                    onChangeText={(text)=>{setEmail(text)}}
                    />
                </View>
            </View>
    
            <View style={styles.loginRow}>
                <View style={styles.loginLabelContainer}>
                    <Text style={styles.loginLabelText}>Password: </Text>
                </View>
                <View style={styles.loginInputContainer}>
                    <TextInput 
                    style={styles.loginInputBox}
                    placeholder='enter password' 
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text)=>{setPassword(text)}}
                    />
                </View>
            </View>

            <View style={styles.modeSwitchContainer}>
                {mode === 'login' ?
                    <Text>New user? 
                    <Text 
                        onPress={()=>{setMode('signup')}} 
                        style={{color: 'blue'}}> Sign up </Text> 
                    instead!</Text>
                :
                    <Text>Existing user? 
                    <Text 
                    onPress={()=>{setMode('login')}} 
                    style={{color: 'blue'}}> Log In </Text> 
                    instead!</Text>}
            </View>
    
            <View style={styles.loginButtonRow}>
                <Button
                    title={mode==='login'?'Log in':'Sign up'}
                    onPress={async ()=>{ 
                        if (mode === 'login') {
                            try {
                                await signInWithEmailAndPassword(auth, email, password);
                                console.log('logged in user', email);
                            } catch(error) {
                                console.log("Sign Up Error", error.message,[{ text: "OK" }]);
                                Alert.alert("Log in Error", error.message,[{ text: "OK" }]);
                            }
                        } 
                        else {
                            try {
                                await createUserWithEmailAndPassword(auth, email, password);  
                                console.log('created user', email);
                            } catch(error) {
                                console.log("Sign Up Error", error.message,[{ text: "OK" }]);
                                Alert.alert("Sign Up Error", error.message,[{ text: "OK" }]);
                            }
                        }
                        setEmail('');
                        setPassword('');
                }}/>
            </View>
        </View>
        </View>
    );
}
    

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
},

loginContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingTop: '30%',
    paddingBottom: '10%'
},
loginRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
},
loginLabelContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'flex-end'
},
loginLabelText: {
    fontSize: 18
},
loginInputContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
},
loginInputBox: {
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: '2%'
},
modeSwitchContainer:{
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
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center'
},
sectionHeaderText: {
    fontSize: 36
},
listContainer: {
    flex: 0.7, 
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
},
});
