import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the EditPhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-photo',
  templateUrl: 'edit-photo.html',
})
export class EditPhotoPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cameraPlugin: Camera,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPhotoPage');
  }
  openGallery(): void {
    this.cameraPlugin 
      .getPicture({
        quality: 95,
        destinationType: this.cameraPlugin.DestinationType.FILE_URI,
        sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.cameraPlugin.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500,
        correctOrientation: true
      })
      .then(
        imageData => {
          this.viewCtrl.dismiss({imgurl: imageData});
          // this.userProfile.photo = imageData;
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
  }

  openCamera(): void{
    console.log("open camera");
    this.cameraPlugin 
      .getPicture({
        quality: 95,
        destinationType: this.cameraPlugin.DestinationType.FILE_URI,
        sourceType: this.cameraPlugin.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.cameraPlugin.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: true,
        correctOrientation: true
      })
      .then(
        imageData => {
          this.viewCtrl.dismiss({imgurl: imageData});
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
  }
}
