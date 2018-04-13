import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  Loading,
  LoadingController
 } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase';
/**
 * Generated class for the MyTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-task',
  templateUrl: 'my-task.html',
})
export class MyTaskPage {
  public postedTaskList: Array<any>;
  public offeredTaskList: Array<any>;
  public loadedPosted: Array<any>;
  public loadedOffered: Array<any>;
  public tasks;
  public userProfile: any;
  public userId=  firebase.auth().currentUser ;
  public loading: Loading = null;
  public postedtype;
  public offeredtype;
  public loadP: boolean = false;
  public loadO: boolean =false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    public loadingCtrl: LoadingController
  ) {
    
    console.log('ionViewDidLoad MyTaskPage');
  }

  ionViewDidEnter() {
    this.loadP = false;
    this.loadO = false;
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    setTimeout(() => {
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
    }, 10000);

    this.tasks = `posted`;
    this.postedtype=`All tasks`;
    this.offeredtype=`All tasks`;
    this.postedTaskList = [];
    this.offeredTaskList = [];

    console.log('ionViewDidLoad MyTaskPage');
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
        this.userProfile= userProfileSnapshot.val();
        this.userProfile.photo = userProfileSnapshot.val().photo;
    });

    this.taskProvider
    .getPostedTaskList()
    .on("value", postedSnapshot => {
      this.postedTaskList = [];
      postedSnapshot.forEach(taskSnap => {
        this.taskProvider.getTaskDetail(taskSnap.key).on("value", snap => {
          this.postedTaskList.push({
            id: snap.key,
            name: snap.val().name,
            date: snap.val().date,
            category: snap.val().category,
            description: snap.val().description,
            budget: snap.val().budget, 
            tasker: snap.val().tasker,
            photo: this.userProfile.photo,
            taskerNumber: snap.val().taskerNumber,
            assignNumber: snap.val().assignNumber,
            completedNumber: snap.val().completedNumber,
            location: snap.val().location.place
          }); 
          console.log(snap.val().taskerNumber);
        });

      return false;
      
      });
      this.loadedPosted = this.postedTaskList;
      this.loadP = true;
      console.log("posted", this.loadP);
      if(this.loading != null && this.loadP && this.loadO ){
        this.loading.dismiss();
        this.loading =null;
      }
   });
   
   this.taskProvider
   .getOfferedTaskList()
   .on("value", offeredSnapshot => {
     this.offeredTaskList = [];
     offeredSnapshot.forEach(taskSnap => {
      this.taskProvider.getTaskDetail(taskSnap.key).on("value", snap => {
        if (snap.hasChildren()) {
          this.profileProvider.getOtherProfile(snap.val().poster).on("value", userProfileSnapshot => {
            this.offeredTaskList.push({
             id: snap.key,
             name: snap.val().name,
             date: snap.val().date,
             category: snap.val().category,
             description: snap.val().description,
             budget: snap.val().budget, 
             tasker: snap.val().tasker,
             photo :userProfileSnapshot.val().photo,
             taskerNumber: snap.val().taskerNumber,
             assignNumber: snap.val().assignNumber,
             completedNumber: snap.val().completedNumber,
             location: snap.val().location.place
           }); 
          }); 
        }
      });
     return false;
     });
     this.loadedOffered = this.offeredTaskList;
     this.loadO = true;
     console.log("offer", this.loadO);
     if(this.loading != null && this.loadO && this.loadP ){
      this.loading.dismiss();
      this.loading =null;
    }
  });

  }
  goToTaskDetail(taskId):void{
    this.navCtrl.push('TaskDetailPage', {taskId: taskId});
  }

  onChange(){
    console.log(this.offeredtype);
    this.offeredTaskList = this.loadedOffered.filter((v) => {  
      if(v.taskerNumber!=v.completedNumber && this.offeredtype === `Completed tasks`) {
        return false;
      }
      if((v.taskerNumber!=v.completedNumber || v.taskerNumber> v.assignNumber) && this.offeredtype === `On-going tasks`) {
        return false;
      }
      if(v.taskerNumber==v.assignNumber && this.offeredtype === `Open tasks`) {
        return false;
      }
      return true;
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.ionViewDidEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
