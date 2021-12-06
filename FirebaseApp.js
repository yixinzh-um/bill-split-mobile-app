import {initializeApp, getApps } from "firebase/app";
import firebaseConfig from "./Secrets";
import { initializeFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
  useFetchStreams: false
});
const storage = getStorage(app);

export function getDB(){
  return db;
}
export function getStore(){
  return storage;
}