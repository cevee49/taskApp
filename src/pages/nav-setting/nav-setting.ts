import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";

/**
 * Generated class for the NavSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nav-setting',
  templateUrl: 'nav-setting.html',
})
export class NavSettingPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NavSettingPage');
  }

  logOut() : void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }
  editProfile(){
    this.navCtrl.push('EditProfilePage');
  }

  changeEmail(){
    this.navCtrl.push('ChangeEmailPage');
  }
}
