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
  constructor() {
    this.userList = [];
    this.userInfo = {}
    this.userListeners = [];
    this.initUsersOnSnapshot();
  }

  
  addUserListener(callbackFunction) {
    const listenerId = Date.now(); // need an ID for deletion later
    const listener = {
      id: listenerId,
      callback: callbackFunction  
    };  
    this.userListeners.push(listener);
    callbackFunction(); // have the caller check right away
    return listenerId;
  }
  removeUserListener(listenerId) {
    let idx = this.userListeners.findIndex((elem)=>elem.id===listenerId);
    this.userListeners.splice(idx, 1);
  }
  notifyUserListeners() {
    for (let ul of this.userListeners) {
      ul.callback();
    }
  }


  async logIn() {
    await createUserWithEmailAndPassword(auth, email, password);  
  }

  async signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async updateUserName(email, userName) {
    const docRef = doc(db, "userInfo", email);
    await setDoc(docRef, {email: email, "userName": userName});
    this.notifyUserListeners();
  }

  initUsersOnSnapshot() {
    onSnapshot(userInfo, (qSnap) => {
      if (qSnap.empty) return;
      let userList = [];
      qSnap.forEach((docSnap) => {
        let user = docSnap.data();
        user.key = docSnap.id;
        userList.push(user);
      });
      this.userList = userList;
    });
    this.notifyUserListeners();
  }

  getUser(email) {
    for (let user of this.userList) {
      if (user.id = email) {
        return user;
      }
    }
  }

  getUserList() {
    return this.userList;
  }
};

export function getUserModel() {
  if(!userModel){
    userModel = new UserModel();
  }
  return userModel;
};

export function resetUserModel() {
  userModel = undefined;
}