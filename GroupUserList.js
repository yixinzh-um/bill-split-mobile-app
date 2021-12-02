import { 
  initializeFirestore, collection,  
  onSnapshot, query, getDocs,
  doc, addDoc, setDoc, updateDoc, where, getDoc
  } from "firebase/firestore";

import React, { useEffect, useState } from 'react';
import {getDB} from "./FirebaseApp";
const db = getDB();

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
      "purpose": purpose
    });
    const groupId = docRef.id
    await addDoc(collection(db, "Membership"), {
      "email": email,
      "groupId": groupId,
      "balance": 0
    });
    for(const userEmail in this.users){
      await addDoc(collection(db, "Membership"), {
        "email": userEmail,
        "groupId": groupId,
        "balance": 0
      });
    }
  }

  async load(groupId){ // init basic infomation about the group
    this.groupId = groupId
    const docSnap = await getDoc(doc(db, "group", this.groupId));
    const data = docSnap.data();
    this.name = data.name;
    this.purpose = data.purpose;
    loadMemberShip();
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
let groupUserList;

export function getGroupUserList(){
  if(!groupUserList){
    groupUserList = new GroupUserList();
  }
  return groupUserList;
};

export function resetGroupUserList(){
  groupUserList = undefined;
}