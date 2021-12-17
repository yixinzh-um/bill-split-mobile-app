import { 
  initializeFirestore, collection,  
  onSnapshot, query, getDocs,
  doc, addDoc, setDoc, updateDoc, where, getDoc
  } from "firebase/firestore";

import { getDB } from "./FirebaseApp";

const db = getDB();
const userInfo = collection(db, "UserInfo");

class UserModel{
  constructor(email) {
    this.currentUser = {};
    this.userInfo = {}
    this.listeners = [];
    this.email = email;
    this.user = {
      email: '',
      name: '',
      contacts: [],
      acceptNotification: false
    }
    this.initUser();
  }

  async initUser() {
    const q = query(userInfo, where("email", "==", this.email));
    const querySnapShot = await getDocs(q);
    const docRef = doc(db, "UserInfo", this.email);
    if (querySnapShot.size == 0) {
      let userContents = {email: this.email, 
                          name: this.email.split('@')[0], 
                          contacts: [], acceptNotification: false};
      await setDoc(docRef, userContents);
      this.user = userContents;
    }

    onSnapshot(docRef, (qSnap) => {
      const data = qSnap.data();
      this.name = data.name;
      this.user = data;
      this.notifyListener();
    });
  }

  async updateNotification(accept) {
    const docRef = doc(db, "UserInfo", this.email);
    await updateDoc(docRef, {acceptNotification: accept});
    this.notifyListener();
  }

  async updateUserName(name) {
    const docRef = doc(db, "UserInfo", this.email);
    await updateDoc(docRef, {email: this.email, "name": name});
    this.notifyListener();
  }

  async addContact(contact) {
    const docRef = doc(db, "UserInfo", this.email);
    let contacts = Array.from(this.user.contacts);
    contacts.push(contact);
    await updateDoc(docRef, {contacts: contacts});
    this.notifyListener();
  }
  async removeContact(contact) {
    const docRef = doc(db, "UserInfo", this.email);
    let contacts = Array.from(this.user.contacts);
    let idx = contacts.findIndex((elem) => elem === contact); 
    contacts.splice(idx, 1);
    await updateDoc(docRef, {contacts: contacts});
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

  getUser(email) {
    for (let user of this.userList) {
      if (user.id = email) {
        return user;
      }
    }
  }

  getCurrentUser() {
    return this.user;
  }
};

let userModel = undefined;
export function getUserModel(email) {
  if (!userModel) {
    userModel = new UserModel(email);
  }
  return userModel;
};

export function resetUserModel() {
  userModel = undefined;
};