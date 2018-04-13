import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReviewProvider } from "../../providers/review/review";
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public reviewProvider: ReviewProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewListPage');
    this.taskerReviewList = [];
    this.posterReviewList = [];
    this.reviewProvider
    .getTaskerReview()
    .orderByChild('timestamp')
    .on("value", taskerSnapshot => {
      this.taskerReviewList = [];
      taskerSnapshot.forEach(snap => {
        console.log(snap.val().offerPrice);
        this.taskerReviewList.push({
          id: snap.key,
          posterId: snap.val().posterId,
          posterName: snap.val().posterName,
          rate: snap.val().rate,
          review: snap.val().review,
          taskName: snap.val().taskName
        }); 
      return false;
      });
   });
  }

}
