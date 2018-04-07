import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskUpdatePage } from './task-update';

@NgModule({
  declarations: [
    TaskUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(TaskUpdatePage),
  ],
})
export class TaskUpdatePageModule {}
