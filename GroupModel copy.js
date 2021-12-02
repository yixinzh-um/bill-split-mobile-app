// import {initializeApp, getApps } from "firebase/app";
// import firebaseConfig from "../../Secrets";
// import { 
//     initializeFirestore, collection,  
//     onSnapshot, query, getDocs,
//     doc, addDoc, setDoc, updateDoc, where, getDoc
//   } from "firebase/firestore";

import React, { useEffect, useState } from 'react';

let app, userModel;
// if (getApps().length == 0){
//     app = initializeApp(firebaseConfig);
// } 
// const db = initializeFirestore(app, {
//     useFetchStreams: false
// });

// const memberShip = collection(db, "memberShip");
// const group = collection(db, "group");

class GroupModel{
    constructor(){
        this.users = {};
        this.name = undefined;
        this.purpose = undefined;
        this.groupId = undefined;
        this.subscribers = [];
    }

    updateSubscribers(){
        console.log(this.subscribers);
        for(let sub of this.subscribers)sub();
    }

    addSubscribers(sub){
        this.subscribers.push(sub);
    }

    async load(groupId){ // init basic infomation about the group
        this.groupId = groupId
        const docSnap = await getDoc(doc(db, "group", this.groupId));
        const data = docSnap.data();
        this.name = data.name;
        this.purpose = data.purpose;
        loadMemberShip();
    }

    async loadMemberShip(){ // Load all related user and their balance in this group
        const q = query(memberShip, where("groupId", "==", this.groupId));
        onSnapshot(q, qSnap => {
            qSnap.forEach((doc)=>{
                data = doc.data();
                this.users[data["email"]] = data["balance"];
            })
        });
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
        console.log("add user " + email);
        this.updateSubscribers();
    }

    deleteUser(email){
        delete this.users[email];
        this.updateSubscribers();
    }
};
let groupModel;
export function getGroupModel(){
    if(!groupModel){
        groupModel = new GroupModel();
    }
    return groupModel;
    // console.log("loadGroup");
    // const q = query(memberShip, where("email", "==", email));
    // const querySnapShot = await getDoc(q);
    // const groupIds = new Set();
    // querySnapShot.forEach((doc)=>{
    //     groupIds.add(doc.data().groupId);
    // });
    // const groups = Array.from(groupIds, groupId=>GroupModel(groupId));
    // return groups;
};