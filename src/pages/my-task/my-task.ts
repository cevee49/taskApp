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
  public tasks;
  public userProfile: any;
  public userId=  firebase.auth().currentUser ;
  public loading: Loading;

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
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.tasks = `posted`;
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
           console.log(snap.val().budget);
          }); 
        }
      });
     return false;
     });
     this.loading.dismiss();
  });

  }
  goToTaskDetail(taskId):void{
    this.navCtrl.push('TaskDetailPage', {taskId: taskId});
  }
}
