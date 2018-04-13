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
  public posterRef:firebase.database.Reference;
  public profile:firebase.database.Reference;
  public candidateRef: firebase.database.Reference;

  constructor(public http: Http) {
    console.log('Hello ReviewProvider Provider');
    this.candidateRef = firebase.database().ref(`candidateList`);
      this.reviewRef = firebase.database().ref(`review`);
      this.posterRef = firebase.database().ref(`poster`);
      this.profile = firebase.database().ref(`/userProfile`);
  }

  addReview(taskId: string, role: string, taskerId: string, taskName:string, rate: number, review: string, posterId: string ): PromiseLike<any> {
    if(role === `poster`){
      this.posterRef.child(`${taskId}`).set({[posterId]: true });
    }
    
    return this.candidateRef.child(`${taskId}/${taskerId}`).update({
      review: true
    }).then(()=>{
      this.reviewRef
    .child(`${taskerId}/${role}/`)
    .push({
      taskId: taskId,
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
    });
  });
  }


  getTaskerReview(userId:string): firebase.database.Query{
    if (!userId){
      console.log("hidfas");
      const uid: string = firebase.auth().currentUser.uid;
      return this.reviewRef.child(`${uid}/tasker`).orderByChild('timestamp');
    }
    return this.reviewRef.child(`${userId}/tasker`).orderByChild('timestamp');
  
  }
  getPosterReview(userId: string): firebase.database.Query{
    if (!userId){
      const uid: string = firebase.auth().currentUser.uid;
      return this.reviewRef.child(`${uid}/poster`).orderByChild('timestamp');
    }
    return this.reviewRef.child(`${userId}/poster`).orderByChild('timestamp');
  
  }

  getPosterOneReview(taskId: string){
    return this.posterRef.child(`${taskId}`);
  }

}
