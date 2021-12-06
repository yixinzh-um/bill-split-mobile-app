import { 
  initializeFirestore, collection,  
  onSnapshot, query, getDocs,
  doc, addDoc, setDoc, updateDoc, where, getDoc
  } from "firebase/firestore";

import React, { useEffect, useState } from 'react';
import { getDB } from "./FirebaseApp";

let userModel;
const db = getDB();
const userInfo = collection(db, "userInfo");

class UserModel{
  constructor(email) {
    this.userList = [];
    this.userInfo = {}
    this.listeners = [];
    this.email = email
    this.initUser();
  }

  async initUser(){
    const q = query(userInfo, where("email", "==", this.email));
    const querySnapShot = await getDocs(q);
    const docRef = doc(db, "userInfo", this.email);
    if(querySnapShot.size==0){
      await setDoc(docRef, {"email": this.email, "name": "User"});
    }
    onSnapshot(doc(db, "userInfo", this.email), (qSnap) => {
      const data = qSnap.data();
      this.name = data.name;
      this.notifyListener();
    });
    this.notifyListener();
  }

  async updateUserName(name) {
    const docRef = doc(db, "userInfo", this.email);
    await updateDoc(docRef, {email: this.email, "name": name});
    const data = (await getDoc(docRef)).data();
    this.notifyListener();
  }

  addListener(callbackFunction) {
    const listenerId = Date.now();
    const listener = {
      id: listenerId,
      callback: callbackFunction
    }
    this.listeners.push(listener);
    callbackFunction();
    return listenerId;
  }

  removeListener(listenerId) {
    let idx = this.listeners.findIndex((elem)=>elem.id===listenerId);
    this.listeners.splice(idx, 1);
  }

  notifyListener() {
    for (const tl of this.listeners) {
      tl.callback();
    }
  }

};

export function getUserModel(email) {
  if(!userModel){
    userModel = new UserModel(email);
  }
  return userModel;
};

export function resetUserModel() {
  userModel = undefined;
}