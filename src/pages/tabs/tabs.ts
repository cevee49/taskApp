import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController} from 'ionic-angular';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { Tab4Root } from '../pages';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // @ViewChild('myTabs') tabRef: Tabs;

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";

  constructor(public navCtrl: NavController) {

      this.tab1Title = "Browse";
      this.tab2Title = "My tasks";
      this.tab3Title = "Messages";
      this.tab4Title = "Profile";
 
  }
//   switchTab(tabIndex) {
//     this.tabs.select(tabIndex);
// }
}
