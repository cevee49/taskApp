import firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  public imgurl = `https://firebasestorage.googleapis.com/v0/b/taskapp-cv49.appspot.com/o/image%2Fdefaultpicture.png?alt=media&token=3cfa48d6-5726-40ef-8396-92cbb27efbef`
  constructor() {
    console.log('Hello AuthProvider Provider'); 
  }

  loginUser(email: string, password: string) : Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, firstName: string, lastName: String) : Promise<any>{
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
      var fullName = firstName +` `+ lastName.charAt(0) + `.`;
        newUser.updateProfile({
          displayName: fullName
        }).then(()=>{
          firebase
          .database()
          .ref(`/userProfile/${newUser.uid}`)
          .set({email: email, firstName: firstName, lastName: lastName, photo: this.imgurl, createdAt: Date.now()} );
        })
        
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email: string) : Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .off();
    return firebase.auth().signOut();
  }

}
