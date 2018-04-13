import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewListPage } from './review-list';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ReviewListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewListPage),
    Ionic2RatingModule,
  ],
})
export class ReviewListPageModule {}
