import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  Alert,
  AlertController,
  ModalController,
  Loading,
  LoadingController
 } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { ReviewProvider } from "../../providers/review/review";
import { ChatProvider } from "../../providers/chat/chat";
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase';

/**
 * Generated class for the TaskDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
})
export class TaskDetailPage {
  public currentTask: any= {};
  public tasker: any =  {};
  public userId: string=  firebase.auth().currentUser.uid ;
  public candidateList: Array<any>;
  public taskerList: Array<any>;
  public completedList: Array<any>;
  public poster:any;
  public usertasker:boolean = false;
  public usercomplete:boolean = false;
  public offered: boolean = false;
  public completed: boolean = false;
  public reviewed: boolean = false;
  public loading: Loading=null ;
  public load1: boolean = false;
  public load2: boolean = false;
  public load3: boolean = false;
  public load4: boolean = false;
  public load5: boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    public reviewProvider: ReviewProvider,
    public chatProvider: ChatProvider,
    public alertCtrl: AlertController,
    private modalCtrl : ModalController,
    public loadingCtrl: LoadingController,
  ) {}

  ionViewDidEnter() {
    console.log('ionViewDidLoad TaskDetailPage');
   
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    setTimeout(() => {
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
    }, 10000);

    this. taskProvider
    .getTaskDetail(this.navParams.get("taskId"))
    .once("value", taskSnapshot => {
      if(taskSnapshot!=null){
      this.currentTask = taskSnapshot.val();
      this.currentTask.id = taskSnapshot.key;
      this.currentTask.date = taskSnapshot.val().date;
      this.currentTask.name = taskSnapshot.val().name;
      this.currentTask.poster = taskSnapshot.val().poster;
      this.currentTask.description = taskSnapshot.val().description;
      this.currentTask.location = taskSnapshot.val().location.place;
      this.currentTask.createdAt= 0-taskSnapshot.val().createdAt;
      this.currentTask.assignNumber = taskSnapshot.val().assignNumber;
      this.currentTask.takerNumber = taskSnapshot.val().taskerNumber;
      this.load1 = true;
      if(this.loading != null && this.load1 && this.load2 && this.load3 && this.load4 && this.load5){
        this.loading.dismiss();
        this.loading =null;
      }
      }
    });

    this.profileProvider.getOtherProfile(this.currentTask.poster).on("value", userProfileSnapshot => {
     this.poster = userProfileSnapshot.val();
     this.poster.photo = userProfileSnapshot.val().photo;
     this.poster.posterReviewAve = userProfileSnapshot.val().posterReviewAve;
     this.poster.firstName= userProfileSnapshot.val().firstName;
     this.poster.lastName= userProfileSnapshot.val().lastName;
     this.poster.fullName = this.poster.firstName +` `+  this.poster.lastName.charAt(0) + `.`;
     this.load2 = true;
     if(this.loading != null && this.load1 && this.load2 && this.load3 && this.load4 && this.load5){
      this.loading.dismiss();
      this.loading =null;
    }
    });

    this.taskProvider
      .getCandidate(this.navParams.get("taskId"))
      .orderByChild('status')
      .equalTo(`candidate`)
      .on("value", candidateSnapshot => {
        this.candidateList = [];
        candidateSnapshot.forEach(snap => {
          if(snap.key == this.userId){
            this.offered =true;
          }
          this.profileProvider.getOtherProfile(snap.key).on("value", userProfileSnapshot => {
            var firstName= userProfileSnapshot.val().firstName;
            var lastName= userProfileSnapshot.val().lastName;
            var fullName = firstName +` `+  lastName.charAt(0) + `.`;
            this.candidateList.push({
            id: snap.key,
            name: fullName,
            offerPrice: snap.val().offerPrice,
            photo: userProfileSnapshot.val().photo,
            rating: userProfileSnapshot.val().taskerReviewAve
            });
            // console.log(snap.val().taskerReviewAve);
          });
        return false;
        });
        this.load3 = true;
        if(this.loading != null && this.load1 && this.load2 && this.load3 && this.load4 && this.load5){
          this.loading.dismiss();
          this.loading =null;
        }
     });

    this.taskProvider
     .getCandidate(this.navParams.get("taskId"))
     .orderByChild('status')
     .equalTo(`tasker`)
     .on("value", taskerSnapshot => {
       this.taskerList = [];
       taskerSnapshot.forEach(snap => {
         if(snap.key == this.userId){
           this.usertasker =true;
           console.log("tasle", snap.val().completed);
           if(snap.val().completed){
             this.usercomplete = true;
           }
         }
         this.profileProvider.getOtherProfile(snap.key).on("value", userProfileSnapshot => {
          var firstName= userProfileSnapshot.val().firstName;
          var lastName= userProfileSnapshot.val().lastName;
          var fullName = firstName +` `+  lastName.charAt(0) + `.`;
         this.taskerList.push({
           id: snap.key,
           name: fullName,
           completed: snap.val().completed,
           photo: userProfileSnapshot.val().photo,
           review: snap.val().review
         });
        });
       return false;
       });
       this.load4 = true;
       if(this.loading != null && this.load1 && this.load2 && this.load3 && this.load4 && this.load5){
        this.loading.dismiss();
        this.loading =null;
      }
    });
    this.reviewProvider
    .getPosterOneReview(this.currentTask.id)
    .once("value", reviewSnapshot => {
      console.log(reviewSnapshot.key);
      if (reviewSnapshot.hasChild(this.userId)){
        this.reviewed =true;
      }
      this.load5 = true;
      if(this.loading != null && this.load1 && this.load2 && this.load3 && this.load4 && this.load5){
       this.loading.dismiss();
       this.loading =null;
     }
    });
  }

  addCandidate(): void {
    const alert: Alert = this.alertCtrl.create({
      title: this.currentTask.description,
      message: "your offer price",
      inputs: [
        {
          name: "offerPrice",
          value: this.currentTask.budget,
          type: "number"
        }
      ],
      buttons: [
       { text: 'Make an Offer',
         handler: data => {
          alert.present();
          this.taskProvider.addCandidate(this.currentTask.poster,this.currentTask.id, this.currentTask.name, this.currentTask.location,this.currentTask.date, data.offerPrice )
      }}]
    });
    alert.present();  
  }

  addTasker(taskerId): void {
    
    this.taskProvider.addTasker(
      this.currentTask.id, taskerId
    )
  }

  goBack() {
    this.navCtrl.pop();
  }

  chat(buddyId, taskId): void{
    console.log(taskId);
    this.navCtrl.push('ChatroomPage', {buddyId: buddyId, taskId: taskId});
  }
  
  openProfile(userId):void{
    // console.log("tapped");
    this.navCtrl.push('ProfilePage', {userId:userId});
  }

  completeTask(taskerId): void{
    this.taskProvider.completeTask(this.currentTask.id, taskerId).then(()=>{
      this.navCtrl.push('ReviewCreatePage', {taskId:this.currentTask.id, role: `tasker`, taskerId: taskerId, taskName: this.currentTask.name, poster: this.currentTask.poster}); 
    })
  }

  reviewTask(taskerId): void{
    this.navCtrl.push('ReviewCreatePage', {taskId:this.currentTask.id, role: `tasker`, taskerId: taskerId, taskName: this.currentTask.name, poster: this.currentTask.poster}); 
  }

  reviewPoster(taskerId): void {
    this.navCtrl.push('ReviewCreatePage', {taskId:this.currentTask.id, role: `poster`, taskerId: taskerId, taskName: this.currentTask.name, poster: this.userId}); 
  }

  editTask(): void{
    this.navCtrl.push('TaskUpdatePage', {taskId: this.currentTask.id});
  }

  deleteTask(): void {

    let alert: Alert = this.alertCtrl.create({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this task?",
      buttons: [
      {
        text: "Don't Delete",
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
       { text: 'Delete',
         handler: data => {
          this.taskProvider.deleteTask(this.currentTask.id).then(() =>{
            this.navCtrl.pop();
          });
      }}]
    });
    alert.present();  
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
