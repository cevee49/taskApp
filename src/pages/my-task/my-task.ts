import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider
  ) {
    
    console.log('ionViewDidLoad MyTaskPage');
  }

  ionViewDidEnter() {
    this.tasks = `posted`;
    this.postedTaskList = [];
    this.offeredTaskList = [];
    console.log('ionViewDidLoad MyTaskPage');
    this.taskProvider
    .getPostedTaskList()
    .on("value", postedSnapshot => {
      this.postedTaskList = [];
      postedSnapshot.forEach(snap => {
        console.log(snap.val().offerPrice);
        this.postedTaskList.push({
          id: snap.key,
          name: snap.val().name,
          date: snap.val().date,
          category: snap.val().category,
          description: snap.val().description,
          budget: snap.val().budget, 
          tasker: snap.val().tasker
        }); 
      return false;
      });
   });
   this.taskProvider
   .getOfferedTaskList()
   .on("value", offeredSnapshot => {
     this.offeredTaskList = [];
     offeredSnapshot.forEach(snap => {
       console.log(snap.val().offerPrice);
       this.offeredTaskList.push({
         id: snap.key,
         name: snap.val().name,
         date: snap.val().date,
         category: snap.val().category,
         description: snap.val().description,
         budget: snap.val().budget, 
         tasker: snap.val().tasker
       }); 
     return false;
     });
  });

  }
  goToTaskDetail(taskId):void{
    this.navCtrl.push('TaskDetailPage', {taskId: taskId});
  }
}
