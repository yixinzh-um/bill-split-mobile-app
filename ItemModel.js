import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection,  
  query, orderBy, where, onSnapshot,
  doc, addDoc, updateDoc, deleteDoc
} from "firebase/firestore";

import {getDB} from "./FirebaseApp";
const db = getDB();

class ItemModel {
  constructor(groupId) {
    this.itemList = [];
    this.itemListeners = [];
    this.snapshotUnsubscribe = this.subscribeToSnapshot(groupId);
  }

  subscribeToSnapshot(groupId) {
    if (this.snapshotUnsubscribe) {
      this.snapshotUnsubscribe();
    }

    let q = query(collection(db, 'item'), where('groupId', '==', groupId));

    this.snapshotUnsubscribe = onSnapshot(q, (qSnap) => {
      let newItemList = [];
      qSnap.docs.forEach((docSnap)=>{
        let item = docSnap.data();
        item.key = docSnap.id;
        newItemList.push(item);
      });
      this.itemList = newItemList;
      this.notifyTodoListener();
    });
  }

  addItemListener(callbackFunction) {
    const listenerId = Date.now();
    const listener = {
      id: listenerId,
      callback: callbackFunction
    }
    this.todoListeners.push(listener);
    callbackFunction();
    return listenerId;
  }

  removeItemListener(listenerId) {
    let idx = this.todoListeners.findIndex((elem)=>elem.id===listenerId);
    this.todoListeners.splice(idx, 1);
  }

  notifyItemListener() {
    for (const tl of this.itemListeners) {
      tl.callback();
    }
  }

  getItemList() {
      return this.itemList;
  }

  async addItem(item) {
    const docRef = await addDoc(collection(db, 'item'), item);
    item.key = docRef.id;
    this.itemList.push(item);
  }

  async deleteItem(item) {
    const docRef = await doc(db, "item", item.key);
    deleteDoc(docRef);
    let idx = this.itemList.findIndex((elem)=>elem.key === item.key);
    this.itemList.splice(idx, 1);
  }

  async updateItem(newItem) {
    const docRef = doc(db, "item", newItem.key);
    updateDoc(docRef, newItem); 
    let idx = this.itemList.findIndex((elem)=>elem.key === newItem.key);
    this.itemList[idx] = newItem;
  }
}

let itemModel = undefined;

export function getItemModel() {
  if (!itemModel) {
    itemModel = new ItemModel();
  }
  return itemModel;
}
