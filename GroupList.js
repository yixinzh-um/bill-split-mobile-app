import { 
    initializeFirestore, collection,  
    onSnapshot, query, getDocs,
    doc, addDoc, setDoc, updateDoc, where, getDoc
  } from "firebase/firestore";

import React, { useEffect, useState } from 'react';
import {getDB} from "./FirebaseApp";
const db = getDB();
const memberShip = collection(db, "Membership");

class GroupList{
    constructor(){
        this.groups = [];
        this.subscribers = [];
    }

    updateSubscribers(){
        for(let sub of this.subscribers)sub();
    }

    addSubscribers(sub){
        this.subscribers.push(sub);
    }

    async load(email){ // init basic infomation about the group
        const q = query(memberShip, where("email", "==", email));
        const querySnapShot = await getDocs(q);
        this.groups = {}
        querySnapShot.forEach(async (item)=>{
            const groupId = item.data().groupId;
            this.groups[groupId] = {};
        });
        for(const groupId in this.groups){
            const docSnap = await getDoc(doc(db, "Group", groupId));
            const data = docSnap.data();
            if(data==undefined)continue;
            this.groups[groupId] = data;
            this.groups[groupId].groupId = groupId;
        }
        this.updateSubscribers();
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

    getGroupList(){
        let key = 0;
        let ret = [];
        for(const groupId in this.groups){
            const group = this.groups[groupId];
            ret.push(
                {
                    "name": group.name, 
                    "purpose": group.purpose, 
                    "groupId": group.groupId, 
                    "creator": group.creator,
                    "key": key++
                });
        }
        return ret;
    }

};
let groupList;

export function getGroupList(){
    if(!groupList){
        groupList = new GroupList();
    }
    return groupList;
};

export function resetGroupList(){
    groupList = undefined;
}