import {initializeApp, getApps } from "firebase/app";
import firebaseConfig from "./Secrets";
import { initializeFirestore} from "firebase/firestore";
let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
  useFetchStreams: false
});
export function getDB(){
  return db;
}