import { 
  collection,  
  query, orderBy, where, onSnapshot, writeBatch, getDocs,
  doc, addDoc, updateDoc, deleteDoc, setDoc, getDoc
} from "firebase/firestore";
import { getDB } from "./FirebaseApp";

const db = getDB();
const MemberShip = collection(db, "MemberShip");
const Items = collection(db, "Items");

let memberModel = undefined;

class MemberModel {
  constructor(group) {
    this.group = group;
    this.listeners = [];
    this.members = {};
    this.initMemberModel();
  }
  
  async initMemberModel() { // Load all related user and their balance in this group
    const members = query(MemberShip, where("groupId", "==", this.group.groupId));
    const querySnapshot = await getDocs(members);
    querySnapshot.forEach((doc) => {
      const email = doc.data()["email"];
      this.members[email] = 0;
    }); 
    const q = query(Items, where("groupId", "==", this.group.groupId));
    onSnapshot(q, qSnap => {
      const size = Object.keys(this.members).length;
      console.log(size);
      for (const email in this.members)this.members[email] = 0;
      qSnap.forEach((doc) => {
        const data = doc.data();
        const payer = data["payer"];
        const value = data["value"];
        for (const email in this.members) {
          if (email == payer) {
            this.members[email] += value * ( 1 - 1 /size);
          } else {
            this.members[email] -= value / size; 
          }
        }
      });
      for (const email in this.members) {
        this.members[email] = Math.round(this.members[email] * 100) / 100;
      }
      this.notifyListener();
    });
    this.notifyListener();
  }

  getMemberList() {
    let key = 0;
    let ret = [];
    for (const email in this.members) {
      ret.push({"email":email, "key": key++, "balance": this.members[email]});
    }
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
    let idx = this.listeners.findIndex((elem) => elem.id === listenerId);
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
export function resetMemberModel() {
    memberModel = undefined;
}
