import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskDetailPage } from './task-detail';
import { MomentModule } from 'angular2-moment';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    TaskDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskDetailPage),
    MomentModule,
    Ionic2RatingModule
  ],
})
export class TaskDetailPageModule {}
