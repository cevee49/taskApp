import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReviewProvider } from "../../providers/review/review";
import { ProfileProvider } from "../../providers/profile/profile";
/**
 * Generated class for the ReviewListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review-list',
  templateUrl: 'review-list.html',
})
export class ReviewListPage {
  public taskerReviewList: Array<any>;
  public posterReviewList: Array<any>;
  review;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public reviewProvider: ReviewProvider,
    public profileProvider: ProfileProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewListPage');
    this.review = `tasker`;
    this.taskerReviewList = [];
    this.posterReviewList = [];
    this.reviewProvider
    .getTaskerReview(this.navParams.get("userId"))
    .on("value", taskerSnapshot => {
      this.taskerReviewList = [];
      taskerSnapshot.forEach(snap => {
        console.log(taskerSnapshot.val());
        this.profileProvider.getOtherProfile(snap.val().posterId).on("value", userProfileSnapshot => {
          var firstName= userProfileSnapshot.val().firstName;
          var lastName= userProfileSnapshot.val().lastName;
          var fullName = firstName +` `+  lastName.charAt(0) + `.`;
        this.taskerReviewList.push({
          id: snap.key,
          posterId: snap.val().posterId,
          posterName: fullName,
          posterPhoto: userProfileSnapshot.val().photo,
          rate: snap.val().rate,
          review: snap.val().review,
          taskName: snap.val().taskName
        }); 
      }); 
        
      return false;
      });
   });
   this.reviewProvider
   .getPosterReview(this.navParams.get("userId"))
   .on("value", taskerSnapshot => {
     this.posterReviewList = [];
     taskerSnapshot.forEach(snap => {
      this.profileProvider.getOtherProfile(snap.val().posterId).on("value", userProfileSnapshot => {
        var firstName= userProfileSnapshot.val().firstName;
        var lastName= userProfileSnapshot.val().lastName;
        var fullName = firstName +` `+  lastName.charAt(0) + `.`;
       this.posterReviewList.push({
         id: snap.key,
         posterId: snap.val().posterId,
         posterName: fullName,
         rate: snap.val().rate,
         posterPhoto: userProfileSnapshot.val().photo,
         review: snap.val().review,
         taskName: snap.val().taskName
       }); 
      });        
     return false;
     });
  });
  }

  openProfile(userId):void{
    // console.log("tapped");
    this.navCtrl.push('ProfilePage', {userId:userId});
  }


}
