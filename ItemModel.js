import { 
  collection,  
  query, orderBy, where, onSnapshot, getDoc,
  doc, addDoc, updateDoc, deleteDoc, setDoc
} from "firebase/firestore";
import { getDB, getStore } from "./FirebaseApp";
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const db = getDB();
const Items = collection(db, "Items");
const storage = getStore();

class ItemModel {
  constructor(groupId) {
    this.itemList = [];
    this.groupId = groupId;
    this.listeners = [];
    this.image = undefined;
    this.initItemModel();
  }

  async initItemModel() {
    const q = query(Items, where("groupId", "==", this.groupId));
    onSnapshot(q, async (qSnap) => {
      this.itemList = [];
      let key = 0;
      qSnap.forEach(doc => {
        const data = doc.data();
        data["key"] = key++;
        data["id"] = doc.id;
        this.itemList.push(data);
      })
      this.notifyListener();
    }); 
    this.notifyListener();
  }

  async uploadImage(payer) {
    let downloadURL;
    if (this.image) {
      const response = await fetch(this.image.uri);
      const imageBlob = await response.blob();
      const timeStamp = new Date();
      const timeString = timeStamp.toISOString();
      const fileName = this.groupId + "_" + payer + "_" + timeString + ".jpg";
      const fileRef = ref(storage, 'images/' + fileName);
      await uploadBytes(fileRef, imageBlob);
      downloadURL = await getDownloadURL(fileRef);
      this.image = undefined;
    }
    return downloadURL;
  }

  async addItem(itemName, itemValue, payerEmail) {
    let item = {
      "name": itemName, 
      "value": itemValue, 
      "payer": payerEmail, 
      "groupId": this.groupId,
      "date": (new Date()).toLocaleDateString('en-US')
    };
    const url = await this.uploadImage(item.payer);
    if (url)item["image"]=url;
    addDoc(Items, item);
  }

  async updateItem(item, itemName, itemValue) {
    const id = item.id;
    const docRef = doc(db, "Items", id);
    const data = (await getDoc(docRef)).data();
    data["name"] = itemName;
    data["value"] = itemValue;
    const url = await this.uploadImage(item.payer);
    console.log(url);
    if (url)data["image"]=url;
    setDoc(docRef, data);
  }

  async deleteItem(item) {
    const id = item.id;
    deleteDoc(doc(db, "Items", id));
  }

  async updateImage(image) {
    this.image = image;
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
    let idx = this.listeners.findIndex((elem) => elem.id === listenerId);
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

export function resetItemModel() {
  itemModel = undefined;
}

let itemModels = undefined;

export function getItemModels(groups) {
  if (!itemModels) {
    itemModels = groups.map(item => new ItemModel(item.groupId));
  }
  return itemModels;
}

export function resetItemModels() {
  itemModels = undefined;
}