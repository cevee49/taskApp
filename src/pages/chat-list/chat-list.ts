import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from "../../providers/chat/chat";

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  public chatlist : Array<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public chatProvider: ChatProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');

    
    this.chatProvider.getChatList()
    .orderByChild('timestamp')
    .on("value", chatListSnapshot => {
      this.chatlist = [];
      chatListSnapshot.forEach(snap => {
        console.log(snap.val().lastmsg);
        this.chatlist.push({
          id: snap.key,
          lastmsg: snap.val().lastmsg,
          timestamp: 0-snap.val().timestamp,
          taskId: snap.val().taskId,
          buddyId: snap.val().buddyId
        });
        return false;
      });
    });
  }

  goToChatroom (taskId, buddyId): void{
    this.navCtrl.push('ChatroomPage', {buddyId: buddyId, taskId: taskId});
  }
}
