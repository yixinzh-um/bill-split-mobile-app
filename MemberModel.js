import { initializeApp, getApps } from 'firebase/app';
import { 
  collection,  
  query, orderBy, where, onSnapshot, writeBatch,
  doc, addDoc, updateDoc, deleteDoc, setDoc, getDoc
} from "firebase/firestore";
import {getDB} from "./FirebaseApp";

const db = getDB();
const memberShip = collection(db, "Membership");

let memberModel = undefined;

class MemberModel {
  constructor(group) {
    this.group = group;
    this.listeners = [];
    this.members = []
    this.initMemberModel();
  }
  
  async initMemberModel(){ // Load all related user and their balance in this group
    const q = query(memberShip, where("groupId", "==", this.group.groupId));
    onSnapshot(q, qSnap => {
      qSnap.forEach((doc)=>{
        const data = doc.data();
        this.members[data["email"]] = {"balance": data["balance"], "id": doc.id}
      })
      this.notifyListener();
    });
    this.notifyListener();
  }

  getMemberList(){
    let key = 0;
    let ret = [];
    for(const email in this.members){
      ret.push({"email":email, "key": key++, "balance": this.members[email]["balance"]});
    }
    return ret;
  }

  async addItem(itemValue, payerEmail) {
    const userNum = this.getMemberList().length;
    const debit = (itemValue / (userNum - 1)).toFixed(2);
    for(const email in this.members){
      if(email==payerEmail)this.members[email]["balance"] += itemValue;
      else this.members[email]["balance"] -= itemValue;
    }
    const batch = writeBatch(db);
    for(const email in this.members){
      const id = this.members[email]["id"];
      const docRef = doc(db, "Membership", id);
      const docSnap = await getDoc(docRef);
      let data = docSnap.data();
      data["balance"] = this.members[email]["balance"];
      batch.set(docRef, data);
    }
    await batch.commit();
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
export function getMemberModel(group) {
  if (!memberModel) {
    memberModel = new MemberModel(group);
  }
  return memberModel;
}
export function resetMemberModel(){
    memberModel = undefined;
}
