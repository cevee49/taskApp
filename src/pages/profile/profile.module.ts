import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    Ionic2RatingModule,
  ],
})
export class ProfilePageModule {}
