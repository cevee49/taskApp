import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

/*
  Generated class for the ReviewProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReviewProvider {
  public reviewRef:firebase.database.Reference;
    

  constructor(public http: Http) {
    console.log('Hello ReviewProvider Provider');
      this.reviewRef = firebase.database().ref(`review`);
  }

  addReview(taskId: string, role: string, taskerId: string, taskName:string, rate: number, review: string, posterId: string, posterName: string ): PromiseLike<any> {
    return this.reviewRef.child(`${taskerId}/${role}/${taskId}`).update({taskName: taskName, rate:rate, review: review, posterId:posterId, posterName: posterName, timestamp: 0-Date.now()});
  }

  getTaskerReview(): firebase.database.Reference{
    const userId: string = firebase.auth().currentUser.uid;
    return this.reviewRef.child(`${userId}/tasker`);
  }
}
