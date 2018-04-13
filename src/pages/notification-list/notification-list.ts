import { Component, ViewChild } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  Navbar,
  Loading,
  LoadingController } from 'ionic-angular';
import { NotificationProvider } from "../../providers/notification/notification";

/**
 * Generated class for the NotificationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html',
})
export class NotificationListPage {
  public notifList : Array<any>;
  public loading: Loading;

  @ViewChild(Navbar) navBar:Navbar;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public notificationProvider: NotificationProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationListPage');
    this.notificationProvider
    .getNotifList()
    .on("value", notifSnapshot => {
      this.notifList =[];
      notifSnapshot.forEach(snap =>{
        this.notifList.push({
          id: snap.key,
          detail: snap.val().detail,
          type: snap.val().type,
          taskId: snap.val().taskId
        })
        return false;
      })
    })
    this.navBar.backButtonClick = (e:UIEvent) => {
      // this.navCtrl.pop()
      this.navCtrl.pop({animate: true, direction: `forward`});
    };
  }

}
