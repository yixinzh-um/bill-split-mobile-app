import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection,  
  query, orderBy, where, onSnapshot, getDoc,
  doc, addDoc, updateDoc, deleteDoc, setDoc
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
  }

  async initItemModel(){
    const q = query(Items, where("groupId", "==", this.groupId));
    onSnapshot(q, async (qSnap) => {
      this.itemList = [];
      let key = 0;
      qSnap.forEach(doc=>{
        const data = doc.data();
        data["key"] = key++;
        data["id"] = doc.id;
        this.itemList.push(data);
      })
      this.notifyListener();
    }); 
    this.notifyListener();
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

  async updateItem(item, itemName, itemValue){
    const id = item.id;
    const docRef = doc(db, "Items", id);
    const data = (await getDoc(docRef)).data();
    data["name"] = itemName;
    data["value"] = itemValue;
    setDoc(docRef, data);
  }

  async deleteItem(item){
    const id = item.id;
    await deleteDoc(doc(db, "Items", id));

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
