import firebase from 'firebase';
import { firebaseConfig } from './credentials';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, NavController, Alert,AlertController, } from 'ionic-angular';
import { FirstRunPage } from '../pages/pages';
import { MainPage } from '../pages/pages';
import { Settings } from '../providers/providers';
// import { BrowsePage} from '../pages/browse/browse';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';


@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  // rootPage = FirstRunPage;
  rootPage : any;
   

  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') navCtrl: NavController;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Map', component: 'MapPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' },
    { title: 'Browse', component: 'BrowsePage'  },
    { title: 'Post Task', component: 'PostTaskPage'}
  ]

  constructor(
    private translate: TranslateService, 
    private platform: Platform, 
    settings: Settings, 
    private config: Config, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    public fcm: FCM,
    public network: Network,
    public alertCtrl: AlertController,
    
  ) {
    this.initTranslate();
    firebase.initializeApp(firebaseConfig);
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = FirstRunPage;
        unsubscribe();
      } else {
        this.rootPage = MainPage;
        unsubscribe();
      }
    });

    this.platform.ready().then(() => {
      this.fcm.onNotification().subscribe( data =>{
        if(data.wasTapped){
          unsubscribe();
          console.log(JSON.stringify(data));
          this.navCtrl.push('ChatRoomPage');
        }else {
          console.log(JSON.stringify(data));
          this.navCtrl.push('ChatRoomPage');
        }
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      console.log("I'm alive!");
      this.splashScreen.hide();
    });

  }

  ionViewDidLoad() {
    this.network.onDisconnect().subscribe(data => {
      console.log(data);
      const alert: Alert = this.alertCtrl.create({
        title: "No internet connection",
        message: "Please check your connection and try again",
        buttons: ['Dismiss']
      });
      alert.present();  
    }, error => console.error(error));
    this.network.onConnect().subscribe(data => {
      console.log("network", data)
      // this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }
}
