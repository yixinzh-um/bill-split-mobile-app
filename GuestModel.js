let guestModel;
class GuestModel{
  constructor(){
    this.itemList = [];
    this.users = [];
    this.listeners = [];
    this.image = undefined;
  }

  getItemList() {
    let key = 0;
    let ret = [];
    for (const item of this.itemList) {
      item["key"] = key++;
      ret.push(item);
    }
    return ret;
  }

  getUserList() {
    let key = 0;
    let ret = [];
    for (const name in this.users) {
      ret.push({"name":name, "key": key++, "balance": this.users[name]});
    }
    return ret;
  }

  addUser(userName, userBalance){
    userBalance = parseFloat(parseFloat(userBalance).toFixed(2));
    this.users[userName] = userBalance;
    this.notifyListener();
  }

  deleteUser(userName){
    delete this.users[userName];
    this.notifyListener();
  }

  addItem(itemName, itemValue, payerName) {
    let item = {
      "name": itemName, 
      "value": itemValue, 
      "payer": payerName, 
      "image": this.image
    };
    this.itemList.push(item);
    this.users[payerName] += itemValue;
    const length = this.getUserList().length;
    for(const user in this.users)this.users[user] -= (itemValue / length);
    this.image = undefined;
    this.notifyListener();
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

};

export function getGuestModel(){
  if(!guestModel)guestModel = new GuestModel();
  return guestModel;
}

export function resetGuestModel(){
  guestModel = undefined;
}