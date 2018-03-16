import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';

/*
  Generated class for the ImghandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImghandlerProvider {
  imgurl: any;

  constructor(public http: Http,public cameraPlugin: Camera,) {
    console.log('Hello ImghandlerProvider Provider');
  }
  openGallery(): void {
    this.cameraPlugin 
      .getPicture({
        quality: 95,
        destinationType: this.cameraPlugin.DestinationType.FILE_URI,
        sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.cameraPlugin.EncodingType.PNG,
        targetWidth: 1000,
        targetHeight: 1000,
      })
      .then(
        imageData => {
          this.imgurl = imageData;
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
      return this.imgurl;
  }

  openCamera(): string{
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
          this.imgurl = imageData;
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
      return this.imgurl;
  }
     
}
