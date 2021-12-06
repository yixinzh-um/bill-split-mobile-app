import { 
  initializeFirestore, collection,  
  onSnapshot, query, getDocs,
  doc, addDoc, setDoc, updateDoc, where, getDoc
} from "firebase/firestore";

import React, { useEffect, useState } from 'react';
import { TouchableHighlightBase } from "react-native";
import {getDB} from "./FirebaseApp";


const db = getDB();
const memberShip = collection(db, "Membership");
let groupUserList;
let groupList;

class GroupUserList{
  constructor(){
    this.users = {};
    this.subscribers = [];
  }

  updateSubscribers(){
    for(let sub of this.subscribers)sub();
  }

  addSubscribers(sub){
    this.subscribers.push(sub);
  }

  async upload(email, name, purpose){
    const docRef = await addDoc(collection(db, "Group"), {
      "name": name,
      "purpose": purpose,
      "creator": email
    });
    const groupId = docRef.id
    await addDoc(collection(db, "Membership"), {
      "email": email,
      "groupId": groupId,
      "balance": 0
    });
    for(const userEmail in this.users){
      if(userEmail==email)continue;
      await addDoc(collection(db, "Membership"), {
        "email": userEmail,
        "groupId": groupId,
        "balance": 0
      });
    }
  }

  getUserList(){
    let key = 0;
    let ret = [];
    for(const email in this.users){
      ret.push({"email":email, "key": key++});
    }
    return ret;
  }

  addUser(email){
    this.users[email] = {"email": email, "balance": 0};
    this.updateSubscribers();
  }

  deleteUser(email){
    delete this.users[email];
    this.updateSubscribers();
  }
};

class GroupList{
  constructor(email){
    this.groups = {};
    this.listeners = [];
    this.email = email;
    this.initGroupList();
  }

  async initGroupList(){ // init basic infomation about the group
    const q = query(memberShip, where("email", "==", this.email));
    const querySnapShot = await getDocs(q);
    onSnapshot(q, async (qSnap) => {
      this.groups = {}
      qSnap.forEach(doc=>{
        const groupId = doc.data().groupId;
        this.groups[groupId] = {};
      })
      for(const groupId in this.groups){
        const groupRef = doc(db, "Group", groupId);
        this.groups[groupId] = (await getDoc(groupRef)).data();
        this.groups[groupId]["groupId"] = groupId;
      }
      this.notifyListener();
    });
    
    this.notifyListener();

  }

  getGroupList(){
    let key = 0;
    let ret = [];
    for(const groupId in this.groups){
      const group = this.groups[groupId];
      group["key"] = key++;
      ret.push(group);
    }
    return ret;
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

export function getGroupUserList(){
  if(!groupUserList){
    groupUserList = new GroupUserList();
  }
  return groupUserList;
};

export function getGroupList(email){
  if(!groupList){
    groupList = new GroupList(email);
  }
  return groupList;
};

export function resetGroupList(){
  groupList = undefined;
}