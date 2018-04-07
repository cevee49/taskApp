import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  NavController,
  Loading,
  LoadingController,
  NavParams,
  ModalController
  } from "ionic-angular";
  import { ProfileProvider } from "../../providers/profile/profile";
  import { AuthProvider } from "../../providers/auth/auth";
  import { Camera } from '@ionic-native/camera';
  import { FormBuilder, FormGroup, Validators } from "@angular/forms";
  import { EmailValidator } from "../../validators/email";
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  public userProfile: any;
  public editProfileForm: FormGroup;
  public loading: Loading;
  public loadedPhoto: any;
  public photo: string = null;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public navParam: NavParams,
    public cameraPlugin: Camera,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    formBuilder: FormBuilder
  ) {
    this.editProfileForm = formBuilder.group({
      firstName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
       ],
      lastName:[
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      aboutMe:[""]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.editProfileForm.controls['firstName'].setValue(userProfileSnapshot.val().firstName);
      this.editProfileForm.controls['lastName'].setValue(userProfileSnapshot.val().lastName);
      this.editProfileForm.controls['aboutMe'].setValue(userProfileSnapshot.val().aboutMe);
      this.loadedPhoto = userProfileSnapshot.val().photo;
    })
  }

  logOut() : void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

  updateProfile(): void {
    console.log("update profile");
    if (!this.editProfileForm.valid) {
      console.log(
       `Need to complete the form, current value: ${this.editProfileForm.value}`
      );
    } else {
      console.log("validated");
      const aboutMe: string = this.editProfileForm.value.aboutMe;
      const firstName: string = this.editProfileForm.value.firstName;
      const lastName: string = this.editProfileForm.value.lastName;
      if(this.userProfile.photo != this.loadedPhoto){
        this.photo = this.userProfile.photo;
      }
      this.profileProvider.updateProfile(firstName, lastName, aboutMe, this.photo).then(
        profile => {
          this.loading.dismiss();
          this.navCtrl.pop();
      },
      error => {
        this.loading.dismiss().then(() => {
          const alert: Alert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: "cancel" }]
          });
          alert.present();
        });
      }
    );
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    }
  }

  updatePhoto(): void{
    this.profileProvider.updatePhoto(this.userProfile.photo).then(
      profile => {
        console.log("done");
        // this.loading.dismiss();

    },
    error => {
      console.log(error.message);
    }
  );
  }
  // updateName() : void {
  //   const alert: Alert = this.alertCtrl.create({
  //     message: "Your first name & last name",
  //     inputs: [
  //       {
  //         name: "firstName",
  //         placeholder: "Your first name",
  //         value: this.userProfile.firstName
  //       },
  //       {
  //         name: "lastName",
  //         placeholder: "Your last name",
  //         value: this.userProfile.lastName
  //       }
  //     ],
  //     buttons: [
  //       {text: "Cancel" },
  //       {
  //         text: "Save",
  //         handler: data => {
  //           this.profileProvider.updateName(data.firstName, data.lastName);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // updateEmail(): void {
  //   let alert: Alert = this.alertCtrl.create({
  //     inputs: [{ name: 'newEmail', placeholder: 'Your new email' },
  //    { name: 'password', placeholder: 'Your password', type: 'password' }],
  //    buttons: [
  //      { text: 'Cancel' },
  //      { text: 'Save',
  //        handler: data => {
  //         this.profileProvider
  //           .updateEmail(data.newEmail, data.password)
  //            .then(() => { console.log('Email Changed Successfully'); })
  //            .catch(error => { console.log('ERROR: ' + error.message); });
  //     }}]
  //   });
  //   alert.present();
  // }

  // updatePassword(): void {
  //   let alert: Alert = this.alertCtrl.create({
  //     inputs: [
  //       { name: 'newPassword', placeholder: 'New password', type: 'password' },
  //       { name: 'oldPassword', placeholder: 'Old password', type: 'password' }],
  //     buttons: [
  //       { text: 'Cancel' },
  //       { text: 'Save',
  //         handler: data => {
  //         this.profileProvider.updatePassword(
  //           data.newPassword,
  //           data.oldPassword
  //          );
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // updatePhoto(): void{
  //   let modal = this.modalCtrl.create('EditPhotoPage');
  //   // let me = this;
  //   modal.onDidDismiss(data => {
  //     this.userProfile.photo = data.imgurl;
  //   });
  //   modal.present();
  // }

  openGallery(): void {
    this.cameraPlugin 
      .getPicture({
        quality: 95,
        destinationType: this.cameraPlugin.DestinationType.DATA_URL,
        sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.cameraPlugin.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500
      })
      .then(
        imageData => {
          this.userProfile.photo = 'data:image/png;base64,' + imageData;
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
  }

  openCamera(){
    console.log("open camera");
    this.cameraPlugin 
      .getPicture({
        quality: 95,
        destinationType: this.cameraPlugin.DestinationType.DATA_URL,
        sourceType: this.cameraPlugin.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.cameraPlugin.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: true
      })
      .then(
        imageData => {
          this.userProfile.photo = 'data:image/png;base64,' + imageData;
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
  }

  openReview(){
    this.navCtrl.push('ReviewListPage');
  }
}
