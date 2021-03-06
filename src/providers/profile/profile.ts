import firebase, { firestore } from 'firebase';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {

  public userProfile:firebase.database.Reference;
  public currentUser:firebase.User;
  public profile:firebase.database.Reference;
  public userId;

  constructor(public http: Http) {
    console.log('Hello ProfileProvider Provider');
    this.profile = firebase.database().ref(`/userProfile`);
    firebase.auth().onAuthStateChanged( user => {
      if(user) {
        this.currentUser = user;
        // this.currentUser.photoURL = user.photoURL;
        this.userId = firebase.auth().currentUser.uid;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  getCurrentUserID() {
    return this.currentUser.uid;
  }

  getOtherProfile(otherId : string): firebase.database.Reference {
    return this.profile.child(`${otherId}`);
  }

  updateToken(token: string){
    return this.userProfile.update({ token : token});
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    var fullName = firstName +` `+ lastName.charAt(0) + `.`;
    this.currentUser.updateProfile({
      displayName: fullName,
      photoURL: this.currentUser.photoURL
    })
    return this.userProfile.update({ firstName, lastName});
  }

  updatePhoto(photo: string): Promise<any>{
    return firebase
      .storage()
      .ref(`image/guestProfile/${this.userId}/profilePicture.png`)
      .putString(photo, 'base64', {contentType: 'image/png'})
      .then(savedPicture => {
        console.log("yes")
         this.userProfile.update({  photo: savedPicture.downloadURL});
     }).catch(error => {
      console.error(error);
    });
  }

  updateProfile(firstName: string, lastName: string, aboutMe: string, photo: string=null): Promise<any>{
    var fullName = firstName +` `+ lastName.charAt(0) + `.`;
    this.currentUser.updateProfile({
      displayName: fullName,
      photoURL: photo
    })
    if(photo!= null){
      firebase
      .storage()
      .ref(`image/profilePicture/${this.userId}/profilePicture.png`)
      .putString(photo, firebase.storage.StringFormat.DATA_URL)
      .then(savedPicture => {
        console.log("yes")
         this.userProfile.update({ photo: savedPicture.downloadURL});
       })
    }
    return this.userProfile.update({ firstName: firstName, lastName: lastName, aboutMe: aboutMe});
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updateEmail(newEmail).then(user => {
          this.userProfile.update({ email: newEmail});
        });
      })
      .catch(error => {
        console.error(error);
      })
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updatePassword(newPassword).then(user => {
          console.log(`Password Changed`);
        });
      })
      .catch(error => {
        console.error(error);
      })
  }

  updatePicture(profilePicture: string): PromiseLike<any> {
    return firebase
    .storage()
    .ref(`userProfile/${this.userId}/profilePicture.png`)
    .putString(profilePicture, 'base64', { contentType: 'image/png' })
    .then(savedPicture => {
      this.userProfile.child(`profilePicture`)
      .set(savedPicture.downloadURL)
    })
    

  }
}
