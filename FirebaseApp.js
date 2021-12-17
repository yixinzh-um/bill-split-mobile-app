import {initializeApp, getApps } from "firebase/app";
import firebaseConfig from "./Secrets";
import { initializeFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {LogBox } from 'react-native';
let app;
if (getApps().length == 0) {
  app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
  useFetchStreams: false
});
const storage = getStorage(app);

LogBox.ignoreLogs([`AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage`,
`Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.`]);
export function getDB() {
  return db;
}
export function getStore() {
  return storage;
}