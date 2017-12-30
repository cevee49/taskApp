import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostTaskPage } from './post-task';

@NgModule({
  declarations: [
    PostTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(PostTaskPage),
  ],
})
export class PostTaskPageModule {}
