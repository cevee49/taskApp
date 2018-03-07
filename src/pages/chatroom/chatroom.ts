import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from "../../providers/chat/chat";
import { ProfileProvider } from "../../providers/profile/profile";
/**
 * Generated class for the ChatroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {

  public buddy: any =  {};
  public newmessage;
  public allmessages : Array<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public chatProvider: ChatProvider,
    public profileProvider: ProfileProvider
  ) {
    this.profileProvider
      .getOtherProfile(this.navParams.get("buddyId"))
      .on("value", buddySnapshot => {
        this.buddy = buddySnapshot.val();
        this.buddy.id = buddySnapshot.key;
        this.buddy.email = buddySnapshot.val().email;
    });
    this.chatProvider.getMessages(this.navParams.get("taskId")).on("value", chatSnapshot => {
      this.allmessages = [];
      chatSnapshot.forEach(snap => {
        console.log(snap.val().message);
        this.allmessages.push({
          id: snap.key,
          sender: snap.val().sender,
          message: snap.val().message,
          timestamp: snap.val().timestamp,
        });
        return false;
      });
    });
  }

  ionViewDidLoad() {
    console.log('chatroom');
    // console.log(this.navParams.get("buddyId"));
    // this.chatProvider.initializeRoom(this.navParams.get("taskId"));
    
  }

  sendMessage(){
    this.navParams.get("buddyId");
    this.chatProvider.sendMessage(this.newmessage, this.navParams.get("taskId"), this.navParams.get("buddyId")).then(() => {
      // this.content.scrollToBottom();
      this.newmessage = '';
    })
  }
}
