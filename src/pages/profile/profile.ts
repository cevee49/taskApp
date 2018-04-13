import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  Loading,
  LoadingController,
  PopoverController
  } from "ionic-angular";
  import { ProfileProvider } from "../../providers/profile/profile";
  import { AuthProvider } from "../../providers/auth/auth";
  import { Camera } from '@ionic-native/camera';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public loading: Loading =null;
  rate;
  review;
  // public profilePic: string= null;
  imgurl= "assets/img/defaultpicture.png";
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public navParams: NavParams,
    public cameraPlugin: Camera,
    public loadingCtrl : LoadingController,
    public popoverCtrl: PopoverController
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.review = `tasker`;
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    setTimeout(() => {
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
    }, 10000);

    if(this.navParams.get("userId")){
      this.profileProvider.getOtherProfile(this.navParams.get("userId")).on("value", userProfileSnapshot => {
        this.userProfile = userProfileSnapshot.val();
        this.userProfile.firstName = userProfileSnapshot.val().firstName;
        this.userProfile.lastName = userProfileSnapshot.val().lastName;
        this.userProfile.photo = userProfileSnapshot.val().photo;
        this.userProfile.posterReview = userProfileSnapshot.val().posterReview;
        this.userProfile.taskerReview = userProfileSnapshot.val().taskerReview;
        this.userProfile.posterReviewAve = userProfileSnapshot.val().posterReviewAve;
        this.userProfile.taskerReviewAve = userProfileSnapshot.val().taskerReviewAve;
        this.rate = this.userProfile.taskerReviewAve;
        if(this.loading != null){
          this.loading.dismiss();
          this.loading =null;
        }
      })
    } else {
      this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
        this.userProfile = userProfileSnapshot.val();
        this.userProfile.firstName = userProfileSnapshot.val().firstName;
        this.userProfile.lastName = userProfileSnapshot.val().lastName;
        this.userProfile.photo = userProfileSnapshot.val().photo;
        this.userProfile.posterReview = userProfileSnapshot.val().posterReview;
        this.userProfile.taskerReview = userProfileSnapshot.val().taskerReview;
        this.userProfile.posterReviewAve = userProfileSnapshot.val().posterReviewAve;
        this.userProfile.taskerReviewAve = userProfileSnapshot.val().taskerReviewAve;
        this.rate = this.userProfile.taskerReviewAve;
        if(this.loading != null){
          this.loading.dismiss();
          this.loading =null;
        }
      })
     
    }
  }

  logOut() : void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

  

  openReview(){
    this.navCtrl.push('ReviewListPage', {userId:this.navParams.get("userId") });
  }
  
  editProfile(){
    this.navCtrl.push('EditProfilePage');
  }
  presentPopover() {
    // let popover = this.popoverCtrl.create('NavSettingPage',{}, { cssClass: 'custom-popover'});
    // popover.present();
    this.navCtrl.push('NavSettingPage');
  }
}
