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
    const ts= Date.now();
    const roomId ='chat_'+ taskId+'_'+ (buddyId<this.userId ? buddyId+'_'+this.userId : this.userId+'_'+buddyId);
    return this.chatRoomRef.child(`${this.userId}/${roomId}`).update({
      taskId: taskId,
      lastmsg: msg, 
      timestamp: 0- Date.now(),
      buddyId: buddyId,
      read: true
    }).then (() => {
      this.chatRoomRef.child(`${buddyId}/${roomId}`).update({
        taskId: taskId,
        lastmsg: msg, 
        timestamp: 0- Date.now(),
        buddyId: this.userId,
        read: false
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

  getMessages(taskId: string, buddyId: string): firebase.database.Reference{
    const roomId ='chat_'+ taskId+'_'+ (buddyId<this.userId ? buddyId+'_'+this.userId : this.userId+'_'+buddyId);
    return this.messageRef.child(`${roomId}`);
  }

  getChatList(): firebase.database.Reference {
    console.log("getcahtlist");
    return this.chatRoomRef.child(`${this.userId}`);
  }

  setRead(taskId: string, buddyId: string): PromiseLike <any>{
    const roomId ='chat_'+ taskId+'_'+ (buddyId<this.userId ? buddyId+'_'+this.userId : this.userId+'_'+buddyId);
    return this.chatRoomRef.child(`${this.userId}/${roomId}`).update({
      read: true
    })
  }
}

