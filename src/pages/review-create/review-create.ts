import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReviewProvider } from "../../providers/review/review";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
/**
 * Generated class for the ReviewCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review-create',
  templateUrl: 'review-create.html',
})
export class ReviewCreatePage {
  public reviewForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public reviewProvider: ReviewProvider,
    formBuilder: FormBuilder
  ) {
    this.reviewForm = formBuilder.group({
      rate: [
        "1",
        Validators.compose([Validators.required])
       ],
      review:[
        "",
        Validators.compose([Validators.required])
      ]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewCreatePage');
  
  }

  // addReview(rate: number, review: string):void{
    addReview():void{
    if (!this.reviewForm.valid) {
      console.log(
       `Need to complete the form, current value: ${this.reviewForm.value}`
      );
    } else {
      this.navCtrl.pop();
      const rate: number =this.reviewForm.value.rate;
      const review: string =this.reviewForm.value.review; 
      this.reviewProvider.addReview(this.navParams.get("taskId"), this.navParams.get("role"), this.navParams.get("taskerId"), this.navParams.get("taskName"), rate, review, this.navParams.get("poster"));
    }
   
  }
}
