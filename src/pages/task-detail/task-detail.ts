import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    public chatProvider: ChatProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
    // this.userId = firebase.auth().currentUser.uid;
    this. taskProvider
    .getTaskDetail(this.navParams.get("taskId"))
    .on("value", taskSnapshot => {
      this.currentTask = taskSnapshot.val();
      this.currentTask.id = taskSnapshot.key;
      this.currentTask.candidate = taskSnapshot.val().candidate;
      this.currentTask.poster = taskSnapshot.val().poster;
      this.currentTask.tasker = taskSnapshot.val().tasker;
      // this.currentTask.candidate.forEach(snap => {
        console.log(this.currentTask.tasker);
      if(this.currentTask.tasker) {
        this.profileProvider
        .getOtherProfile(this.currentTask.tasker)
        .on("value", taskerSnapshot => {
          console.log("assign tasker");
          this.tasker = taskerSnapshot.val();
          this.tasker.id = taskerSnapshot.key;
          this.tasker.email = taskerSnapshot.val().email;
        });
      }
      // });
    });
    
    if (this.currentTask.poster == this.userId){
      this.taskProvider
      .getCandidate(this.navParams.get("taskId"))
      .on("value", candidateSnapshot => {
        this.candidateList = [];
        candidateSnapshot.forEach(snap => {
          console.log(snap.key);
          this.profileProvider
            .getOtherProfile(snap.key)
            .on("value", userSnapshot => {
              // console.log(userSnapshot.val());
              this.candidateList.push({
                id: snap.key,
                email: userSnapshot.val().email
              });
            });
        return false;
        });
     });
    }   
  }


  addCandidate(): void {
    this.taskProvider.addCandidate(
      this.currentTask.id
    )
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
}
