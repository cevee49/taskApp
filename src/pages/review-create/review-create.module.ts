import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewCreatePage } from './review-create';
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
  declarations: [
    ReviewCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewCreatePage),
    Ionic2RatingModule,
  ],
})
export class ReviewCreatePageModule {}
