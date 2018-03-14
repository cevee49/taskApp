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
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    public chatProvider: ChatProvider,
    public alertCtrl: AlertController,
    private modalCtrl : ModalController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
    // this.userId = firebase.auth().currentUser.uid;
    this. taskProvider
    .getTaskDetail(this.navParams.get("taskId"))
    .on("value", taskSnapshot => {
      this.currentTask = taskSnapshot.val();
      this.currentTask.id = taskSnapshot.key;
      this.currentTask.date = taskSnapshot.val().date;
      this.currentTask.name = taskSnapshot.val().name;
      this.currentTask.poster = taskSnapshot.val().poster.posterId;
      this.currentTask.posterName = taskSnapshot.val().poster.displayName;
      this.currentTask.createdAt= 0-taskSnapshot.val().createdAt;
      this.currentTask.taskStatus = taskSnapshot.val().taskStatus;
      this.currentTask.taskNumber = taskSnapshot.val().taskNumber;
    });
      
      this.taskProvider
      .getCandidate(this.navParams.get("taskId"))
      .orderByChild('status')
      .equalTo(`candidate`)
      .on("value", candidateSnapshot => {
        console.log("candidateLisy");
        this.candidateList = [];
        candidateSnapshot.forEach(snap => {
          console.log(snap.val().offerPrice);
          this.candidateList.push({
            id: snap.key,
            name: snap.val().displayName,
            offerPrice: snap.val().offerPrice
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
         this.taskerList.push({
           id: snap.key,
           name: snap.val().displayName,
           completed: snap.val().completed
          //  offerPrice: snap.val().offerPrice
         });
         console.log(snap.val().displayName);
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
          this.taskProvider.addCandidate(this.currentTask.id, this.currentTask.name, this.currentTask.location,this.currentTask.date, data.offerPrice )
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
  
  completeTask(taskerId): void{
    this.taskProvider.completeTask(this.currentTask.id, taskerId).then(()=>{
      this.navCtrl.push('ReviewCreatePage', {taskId:this.currentTask.id, role: `tasker`, taskerId: taskerId, taskName: this.currentTask.name, poster: this.currentTask.poster, posterName: this.currentTask.posterName}); 
    })
  }
}
