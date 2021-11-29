import {initializeApp, getApps } from "firebase/app";
import firebaseConfig from "../../Secrets";
import { 
    initializeFirestore, collection,  
    onSnapshot, query, getDocs,
    doc, addDoc, setDoc, updateDoc, where, getDoc
  } from "firebase/firestore";

import React, { useEffect, useState } from 'react';

let app, userModel;
if (getApps().length == 0){
    app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
    useFetchStreams: false
});

const userInfo = collection(db, "userInfo");

class UserModel{
    constructor(){
        this.userList = [];
        this.userInfo = {}
        this.subscribers = [];
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
        if(userName!=undefined){
            console.log(userName);
            if(querySnapShot.size==0){
                await setDoc(docRef, {email: email, "userName": userName});
            }
            else{ 
                await updateDoc(docRef, {email: email, "userName": userName});
            }
        }
        this.userInfo[email] = {email:email, "userName": userName};
    }
};

export function getUserModel(){
    if(!userModel){
        userModel = new UserModel();
    }
    return userModel;
};