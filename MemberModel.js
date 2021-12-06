import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection,  
  query, orderBy, where, onSnapshot,
  doc, addDoc, updateDoc, deleteDoc
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
        this.members[data["email"]] = data["balance"];
      })
      this.notifyListener();
    });
    this.notifyListener();
  }

  getMemberList(){
    let key = 0;
    let ret = [];
    for(const email in this.members){
      ret.push({"email":email, "key": key++, "balance": this.members[email]});
    }
    console.log(ret);
    return ret;
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
