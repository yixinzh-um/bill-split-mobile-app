import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from "./src/screens/HomeScreen";
import CreateGroupScreen from "./src/screens/CreateGroupScreen";
import BillSplitScreen from "./src/screens/BillSplitScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import ItemScreen from "./src/screens/ItemScreen";
import DetailScreen from "./src/screens/DetailScreen";
import CameraScreen from './src/screens/CameraScreen';
import SearchScreen from './src/screens/SearchScreen';
import ContactsIndexScreen from "./src/screens/ContactsIndexScreen";
import SummaryScreen from './src/screens/SummaryScreen';
import BalanceScreen from './src/screens/BalanceScreen';
import GuestScreen from "./src/screens/GuestScreen";
import GuestAddItemScreen from "./src/screens/GuestAddItemScreen";
import GuestCameraScreen from "./src/screens/GuestCameraScreen";
import GuestDetailScreen from "./src/screens/GuestDetailScreen";
const Stack = createNativeStackNavigator();

class App extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} options={{headerShown: false}}/>
          <Stack.Screen name="BillSplitScreen" component={BillSplitScreen} options={{headerShown: false}}/>
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ItemScreen" component={ItemScreen} options={{headerShown: false}}/>
          <Stack.Screen name="DetailScreen" component={DetailScreen} options={{headerShown: false}}/>
          <Stack.Screen name="CameraScreen" component={CameraScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ContactsIndexScreen" component={ContactsIndexScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SummaryScreen" component={SummaryScreen} options={{headerShown: false}}/>
          <Stack.Screen name="BalanceScreen" component={BalanceScreen} options={{headerShown: false}}/>
          <Stack.Screen name="GuestScreen" component={GuestScreen} options={{headerShown: false}}/>
          <Stack.Screen name="GuestAddItemScreen" component={GuestAddItemScreen} options={{headerShown: false}}/>
          <Stack.Screen name="GuestCameraScreen" component={GuestCameraScreen} options={{headerShown: false}}/>
          <Stack.Screen name="GuestDetailScreen" component={GuestDetailScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginVertical: 40,
  },
  button: {
    backgroundColor: '#47477b',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
  image: {
    height: 300,
    width: 300,
    marginTop: 30,
    borderRadius: 10,
  },
});