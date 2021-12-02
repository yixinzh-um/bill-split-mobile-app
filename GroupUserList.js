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
        console.log(this.subscribers);
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
let groupUserList;
export function getGroupUserList(){
    if(!groupUserList){
        groupUserList = new GroupUserList();
    }
    return groupUserList;
    // console.log("loadGroup");
    // const q = query(memberShip, where("email", "==", email));
    // const querySnapShot = await getDoc(q);
    // const groupIds = new Set();
    // querySnapShot.forEach((doc)=>{
    //     groupIds.add(doc.data().groupId);
    // });
    // const groups = Array.from(groupIds, groupId=>GroupUserList(groupId));
    // return groups;
};