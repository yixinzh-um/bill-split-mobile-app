import {initializeApp, getApps } from "firebase/app";
import firebaseConfig from "./Secrets";
import { 
    initializeFirestore, collection,  
    onSnapshot, query,
    doc, addDoc, setDoc, updateDoc
  } from "firebase/firestore";

import React, { useEffect, useState } from 'react';

let app, dataModel;
if (getApps().length == 0){
    app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
    useFetchStreams: false
});

class DataModel{
    constructor(){
        this.userList = [];
        this.subscribers = [];
    }

    updateUserList(){
        const query = collection(db, 'users');
        onSnapshot(query, qSnap => {
            this.userList = [];
            qSnap.forEach(docSnap => {
                let u = docSnap.data();
                u.key = docSnap.id;
                this.userList.push(u);
            });
            console.log(this.userList);
        });
    }

    async logIn(){
        await createUserWithEmailAndPassword(auth, email, password);  
    }

    async signIn(email, password){
        await signInWithEmailAndPassword(auth, email, password);
    }
};

export function getDataModel(){
    const q = query(collection(db, "ListMaker3000"));
    if(!dataModel){
        dataModel = new DataModel();
    }
    return dataModel;
};