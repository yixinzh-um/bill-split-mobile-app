import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection,  
  query, orderBy, where, onSnapshot,
  doc, addDoc, updateDoc, deleteDoc
} from "firebase/firestore";

import {getDB} from "./FirebaseApp";
const db = getDB();
const Items = collection(db, "Items");

class ItemModel {
  constructor(groupId) {
    this.itemList = [];
    this.groupId = groupId;
    this.listeners = [];
    this.initItemModel();
    // this.snapshotUnsubscribe = this.subscribeToSnapshot(groupId);
  }

  async initItemModel(){
    const q = query(Items, where("groupId", "==", this.groupId));
    onSnapshot(q, async (qSnap) => {
      this.itemList = [];
      let key = 0;
      qSnap.forEach(doc=>{
        const data = doc.data();
        data["key"] = key++;
        this.itemList.push(data);
      })
      this.notifyListener();
    }); 
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

  async addItem(itemName, itemValue, payerEmail) {
    const item = {
      "name": itemName, 
      "value": itemValue, 
      "payer": payerEmail, 
      "groupId": this.groupId
    };
    const docRef = await addDoc(Items, item);
  }

  // async deleteItem(item) {
  //   const docRef = await doc(db, "item", item.key);
  //   deleteDoc(docRef);
  //   let idx = this.itemList.findIndex((elem)=>elem.key === item.key);
  //   this.itemList.splice(idx, 1);
  // }

  // async updateItem(newItem) {
  //   const docRef = doc(db, "item", newItem.key);
  //   updateDoc(docRef, newItem); 
  //   let idx = this.itemList.findIndex((elem)=>elem.key === newItem.key);
  //   this.itemList[idx] = newItem;
  // }
}

let itemModel = undefined;

export function getItemModel(groupId) {
  if (!itemModel) {
    itemModel = new ItemModel(groupId);
  }
  return itemModel;
}

export function resetItemModel(){
  itemModel = undefined;
}
