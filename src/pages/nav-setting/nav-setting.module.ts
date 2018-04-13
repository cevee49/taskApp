import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NavSettingPage } from './nav-setting';

@NgModule({
  declarations: [
    NavSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(NavSettingPage),
  ],
})
export class NavSettingPageModule {}
