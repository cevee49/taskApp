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
  public profile:firebase.database.Reference;

  constructor(public http: Http) {
    console.log('Hello ReviewProvider Provider');
      this.reviewRef = firebase.database().ref(`review`);
      this.profile = firebase.database().ref(`/userProfile`);
  }

  addReview(taskId: string, role: string, taskerId: string, taskName:string, rate: number, review: string, posterId: string ): PromiseLike<any> {
    return this.reviewRef
    .child(`${taskerId}/${role}/${taskId}`)
    .update({
      taskName: taskName, 
      rate:rate, 
      review: review, 
      posterId:posterId, 
      timestamp: 0-Date.now()
    }).then(()=>{

      this.profile
      .child(`${taskerId}`).transaction(profile => {
        if(role=='tasker'){
            profile.taskerReview+= 1;
            profile.taskerReviewAve= ((( profile.taskerReview-1)*profile.taskerReviewAve)+rate)/ profile.taskerReview;
        } else {
            profile.posterReview+= 1;
            profile.posterReviewAve= ((( profile.posterReview-1)*profile.posterReviewAve)+rate)/ profile.posterReview;
        }
        
        return profile;
      });
    })
    ;
  }

  getTaskerReview(userId:string): firebase.database.Query{
    if (!userId){
      const userId: string = firebase.auth().currentUser.uid;
    }
    return this.reviewRef.child(`${userId}/tasker`).orderByChild('timestamp');
  
  }
  getPosterReview(userId: string): firebase.database.Query{
    if (!userId){
      const userId: string = firebase.auth().currentUser.uid;
    }
    return this.reviewRef.child(`${userId}/poster`).orderByChild('timestamp');
  
  }
}
