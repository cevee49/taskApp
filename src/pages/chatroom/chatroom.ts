import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from "../../providers/chat/chat";
import { ProfileProvider } from "../../providers/profile/profile";
import { TaskProvider } from "../../providers/task/task";

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
  public userProfile: any;
  public taskname: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public chatProvider: ChatProvider,
    public profileProvider: ProfileProvider,
    public taskProvider: TaskProvider
  ) {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile= userProfileSnapshot.val();
      this.userProfile.photo = userProfileSnapshot.val().photo;
   });
    this.profileProvider
      .getOtherProfile(this.navParams.get("buddyId"))
      .on("value", buddySnapshot => {
        this.buddy = buddySnapshot.val();
        this.buddy.id = buddySnapshot.key;
        this.buddy.photo = buddySnapshot.val().photo;
        this.buddy.name = buddySnapshot.val().firstName;
    });
    this.chatProvider.getMessages(this.navParams.get("taskId"), this.navParams.get("buddyId")).on("value", chatSnapshot => {
      this.allmessages = [];
      chatSnapshot.forEach(snap => {
        this.allmessages.push({
          id: snap.key,
          sender: snap.val().sender,
          message: snap.val().message,
          timestamp: snap.val().timestamp

        });
        return false;
      });
    });
    this.chatProvider.setRead(this.navParams.get("taskId"), this.navParams.get("buddyId"));
    this.taskProvider
      .getTaskDetail(this.navParams.get("taskId"))
      .once("value", taskSnapshot => {
        this.taskname = taskSnapshot.val().name;
      });
  }

  ionViewDidLoad() {
    console.log('chatroom');
    // console.log(this.navParams.get("buddyId"));
    // this.chatProvider.initializeRoom(this.navParams.get("taskId"));
    
  }

  sendMessage(){
    this.navParams.get("buddyId");
    console.log("send");
    this.chatProvider.sendMessage(this.newmessage, this.navParams.get("taskId"), this.navParams.get("buddyId")).then(() => {
      // this.content.scrollToBottom();
      this.newmessage = '';
    })
  }
}
