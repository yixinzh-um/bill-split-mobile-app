import { 
  initializeFirestore, collection,  
  onSnapshot, query, getDocs,
  doc, addDoc, setDoc, updateDoc, where, getDoc
  } from "firebase/firestore";

import React, { useEffect, useState } from 'react';
import {getDB} from "./FirebaseApp";

let userModel;
const db = getDB();

const userInfo = collection(db, "userInfo");

class UserModel{
  constructor(){
    this.userList = [];
    this.userInfo = {}
    this.subscribers = [];
  }
  
  updateSubscribers(){
    for(let sub of this.subscribers)sub();
  }

  addSubscribers(sub){
    this.subscribers.push(sub);
  }

  async logIn(){
    await createUserWithEmailAndPassword(auth, email, password);  
  }

  async signIn(email, password){
    await signInWithEmailAndPassword(auth, email, password);
  }

  async updateUserName(email, userName){
    const q = query(userInfo, where("email", "==", email));
    const querySnapShot = await getDocs(q);
    const docRef = doc(db, "userInfo", email);
    if(querySnapShot.size==0){
      await setDoc(docRef, {email: email, "userName": email});
    }
    else if(userName!="")await updateDoc(docRef, {email: email, "userName": userName});
    const data = (await getDoc(docRef)).data();
    this.userInfo[email] = {email:email, "userName": data.userName};
    console.log(this.userInfo);
    this.updateSubscribers();
  }
};

export function getUserModel(){
  if(!userModel){
    userModel = new UserModel();
  }
  return userModel;
};

export function resetUserModel(){
  userModel = undefined;
}