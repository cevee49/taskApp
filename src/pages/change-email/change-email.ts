import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  Alert,
  AlertController,
 } from 'ionic-angular';
 import { ProfileProvider } from "../../providers/profile/profile";
 import { AuthProvider } from "../../providers/auth/auth";


/**
 * Generated class for the ChangeEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-email',
  templateUrl: 'change-email.html',
})
export class ChangeEmailPage {
  public userProfile: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public profileProvider: ProfileProvider,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeEmailPage');
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.userProfile.email = userProfileSnapshot.val().email;
      
      });
  }
  updateEmail(): void {
    const alert: Alert = this.alertCtrl.create({
      inputs: [{ name: 'newEmail', placeholder: 'Your new email' },
      { name: 'password', placeholder: 'Your password', type: 'password' }],
      buttons: [
        { text: 'Cancel' },
        { text: 'Save',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => { console.log('Email Changed Successfully'); })
              .catch(error => { console.log('ERROR: ' + error.message); });
        }}]
    });
    alert.present();
  }
    updatePassword(): void {
      let alert: Alert = this.alertCtrl.create({
        inputs: [
          { name: 'newPassword', placeholder: 'New password', type: 'password' },
          { name: 'oldPassword', placeholder: 'Old password', type: 'password' }],
        buttons: [
          { text: 'Cancel' },
          { text: 'Save',
            handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
             );
            }
          }
        ]
      });
      alert.present();
    }
}
