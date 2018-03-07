import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  public chatRef: firebase.database.Reference;
  public chatMembersRef: firebase.database.Reference; //check member and chat id
  public chatRoomRef: firebase.database.Reference; //chatid
  public messageRef: firebase.database.Reference;
  public membersList: Array<any>;
  public exists;
  public key;
  public room: any= {};
  rooms = [];
  public userId;

  constructor() {
    this.chatRoomRef = firebase.database().ref(`chatroom`);
    this.messageRef = firebase.database().ref(`messages`);
    this.chatMembersRef = firebase.database().ref(`chatmember`);
    // this.chatMembersRef = firebase.database().ref('chatmembers');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userId = firebase.auth().currentUser.uid;
      }
    });
  }

  sendMessage(msg: string, taskId: string, buddyId: string) : Promise<any> {
    const ts= firebase.database.ServerValue.TIMESTAMP;
    const roomId ='chat_'+(taskId<this.userId ? taskId+'_'+this.userId : this.userId+'_'+taskId);
    return this.chatRoomRef.child(`${this.userId}/${roomId}`).update({
      taskId: taskId,
      lastmsg: msg, 
      timestamp: ts,
      buddyId: buddyId
    }).then (() => {
      this.chatRoomRef.child(`${buddyId}/${roomId}`).update({
        taskId: taskId,
        lastmsg: msg, 
        timestamp: ts,
        buddyId: this.userId
      });
    }).then (() => {
      console.log(this.key);
      this.messageRef.child(`${roomId}`).push({
        sender: this.userId,
        // taskId: taskId,
        message: msg, 
        timestamp: ts
      });
    })
  }

  getMessages(taskId: string): firebase.database.Reference{
    console.log(this.userId);
    console.log(taskId);
    const roomId ='chat_'+taskId+'_'+this.userId;
    return this.messageRef.child(`${roomId}`);
  }

  getChatList(): firebase.database.Reference {
    console.log("getcahtlist");
    return this.chatRoomRef.child(`${this.userId}`);
  }

  initializeRoom(taskId: string): firebase.database.Reference{
    console.log("ini");
    // this.chatMembersRef = firebase.database().ref(`chatmember/${taskId}`);
    this.chatRef = firebase.database().ref(`chats/${this.userId}`);
    this.chatMembersRef
      .child(`${taskId}/${this.userId}`)
      .on("value",membersSnapshot => {
        if (membersSnapshot.val() !== null){
          membersSnapshot.forEach(snap => {
            this.key = snap.key;
            // console.log("key");
            console.log("getkey");
            // this.getMessages();
            return false;
          });
        } else {
          console.log("not");
          this.key = this.chatRoomRef.child(`${this.userId}`).push().key;
          console.log(this.key);
          this.exists=false;
          this.chatMembersRef.child(`${this.userId}`).update({[this.key]: true});
        }
      });
      console.log("returnnow")
      return this.messageRef.child(`${this.key}`);
    }

}

