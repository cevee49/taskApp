import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {
  public notifRef: firebase.database.Reference;
  public currentUser:firebase.User;

  constructor(public http: Http) {
    firebase.auth().onAuthStateChanged( user => {
      if(user) {
        this.notifRef = firebase.database().ref(`/notification/${user.uid}`);
      }
    });
    console.log('Hello NotificationProvider Provider');
  }

  getNotifList(){
    console.log("getnotif");
    return this.notifRef.orderByChild('createdAt');
  }
}
