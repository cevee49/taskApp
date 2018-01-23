import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
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
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
    this. taskProvider
    .getTaskDetail(this.navParams.get("taskId"))
    .on("value", taskSnapshot => {
      this.currentTask = taskSnapshot.val();
      this.currentTask.id = taskSnapshot.key;
      this.currentTask.candidate = taskSnapshot.val().candidate;
    });
  }

  addCandidate(): void {
    this.taskProvider.addCandidate(
      this.currentTask.id
    )
  }
}
