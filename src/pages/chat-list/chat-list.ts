import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  Loading,
  LoadingController
 } from 'ionic-angular';
import { ChatProvider } from "../../providers/chat/chat";
import { ProfileProvider } from "../../providers/profile/profile";
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
  public loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public chatProvider: ChatProvider,
    public profileProvider: ProfileProvider,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.chatProvider.getChatList()
    .orderByChild('timestamp')
    .on("value", chatListSnapshot => {
      this.chatlist = [];
      chatListSnapshot.forEach(snap => {
        console.log(snap.val().buddyId);
        this.profileProvider.getOtherProfile(snap.val().buddyId).on("value", userProfileSnapshot => {
          console.log(userProfileSnapshot.val().photo);
        this.chatlist.push({
          id: snap.key,
          lastmsg: snap.val().lastmsg,
          timestamp: 0-snap.val().timestamp,
          taskId: snap.val().taskId,
          buddyId: snap.val().buddyId,
          photo: userProfileSnapshot.val().photo,
          buddyName: userProfileSnapshot.val().firstName,
          read: snap.val().read
        });
        console.log(snap.val().read);
      });
        return false;
      });
      this.loading.dismiss();
    });
  }

  goToChatroom (taskId, buddyId): void{
    this.navCtrl.push('ChatroomPage', {buddyId: buddyId, taskId: taskId});
  }
}
