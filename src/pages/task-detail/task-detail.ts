import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Alert,AlertController,ModalController } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
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
  public completed: boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    public chatProvider: ChatProvider,
    public alertCtrl: AlertController,
    private modalCtrl : ModalController
  ) {}

  ionViewDidEnter() {
    console.log('ionViewDidLoad TaskDetailPage');
    // this.userId = firebase.auth().currentUser.uid;
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
      }
      
    });
    this.profileProvider.getOtherProfile(this.currentTask.poster).on("value", userProfileSnapshot => {
     this.poster = userProfileSnapshot.val();
     this.poster.photo = userProfileSnapshot.val().photo;
     
     this.poster.firstName= userProfileSnapshot.val().firstName;
     this.poster.lastName= userProfileSnapshot.val().lastName;
     this.poster.fullName = this.poster.firstName +` `+  this.poster.lastName.charAt(0) + `.`;
     this
    });
      this.taskProvider
      .getCandidate(this.navParams.get("taskId"))
      .orderByChild('status')
      .equalTo(`candidate`)
      .on("value", candidateSnapshot => {
        this.candidateList = [];
        candidateSnapshot.forEach(snap => {
          this.profileProvider.getOtherProfile(snap.key).on("value", userProfileSnapshot => {
            var firstName= userProfileSnapshot.val().firstName;
            var lastName= userProfileSnapshot.val().lastName;
            var fullName = firstName +` `+  lastName.charAt(0) + `.`;
            this.candidateList.push({
            id: snap.key,
            name: fullName,
            offerPrice: snap.val().offerPrice,
            photo: userProfileSnapshot.val().photo
            });
          });
        return false;
        });
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
         }
         this.profileProvider.getOtherProfile(snap.key).on("value", userProfileSnapshot => {
          var firstName= userProfileSnapshot.val().firstName;
          var lastName= userProfileSnapshot.val().lastName;
          var fullName = firstName +` `+  lastName.charAt(0) + `.`;
         this.taskerList.push({
           id: snap.key,
           name: fullName,
           completed: snap.val().completed,
           photo: userProfileSnapshot.val().photo
         });
        });
       return false;
       });
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
    console.log("bye");
  }

  chat(buddyId, taskId): void{
    console.log(taskId);
    this.navCtrl.push('ChatroomPage', {buddyId: buddyId, taskId: taskId});
  }
  
  openProfile(userId):void{
    this.navCtrl.push('ProfilePage', {userId:userId});
  }

  completeTask(taskerId): void{
    this.taskProvider.completeTask(this.currentTask.id, taskerId).then(()=>{
      this.navCtrl.push('ReviewCreatePage', {taskId:this.currentTask.id, role: `tasker`, taskerId: taskerId, taskName: this.currentTask.name, poster: this.currentTask.poster}); 
    })
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
}
