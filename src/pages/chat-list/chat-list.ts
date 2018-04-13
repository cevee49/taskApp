import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  Loading,
  LoadingController
 } from 'ionic-angular';
 import { TaskProvider } from "../../providers/task/task";
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
  public loading: Loading = null;
  public year: number;
  public month: number;
  public date: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public chatProvider: ChatProvider,
    public profileProvider: ProfileProvider,
    public loadingCtrl: LoadingController,
    public taskProvider: TaskProvider,
  ) {}

  ionViewDidEnter() {
    this.timeConverter(Date.now());
    console.log('ionViewDidLoad ChatListPage');
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    setTimeout(() => {
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
      
    }, 10000);
    this.chatProvider.getChatList()
    .orderByChild('timestamp')
    .on("value", chatListSnapshot => {
      this.chatlist = [];
      chatListSnapshot.forEach(snap => {
        this.profileProvider.getOtherProfile(snap.val().buddyId).on("value", userProfileSnapshot => {
          this. taskProvider
            .getTaskDetail(snap.val().taskId)
            .once("value", taskSnapshot => {
              var a = new Date(0-snap.val().timestamp );
            this.chatlist.push({
              id: snap.key,
              lastmsg: snap.val().lastmsg,
              timestamp: 0-snap.val().timestamp,
              display: (a.getDate()!=this.date || a.getMonth()+1!= this.month || a.getFullYear() != this.year)? false: true,
              taskName: taskSnapshot.val().name,
              buddyId: snap.val().buddyId,
              taskId: snap.val().taskId,
              photo: userProfileSnapshot.val().photo,
              buddyName: userProfileSnapshot.val().firstName,
              read: snap.val().read
            });
          });
        });
        return false;
      });
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
    });
  }

  goToChatroom (taskId, buddyId): void{
    console.log("list",taskId);
    this.navCtrl.push('ChatroomPage', {buddyId: buddyId, taskId: taskId});
  }

  timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp );
    // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    this.year = a.getFullYear();
    this.month = a.getMonth()+1;
    this.date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.ionViewDidEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
