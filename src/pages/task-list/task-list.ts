import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
/**
 * Generated class for the TaskListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {
  public taskList: Array<any>;
  public loadedTaskList: Array<any>;

  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider
  ) {}

  initializeItems():void {
    this.taskList = this.loadedTaskList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskListPage');
    this.taskProvider.getTaskList().on("value", taskListSnapshot => {
      let tasks = [];
      taskListSnapshot.forEach(snap => {
        console.log('ionViewDidLoad TaskListPagedfd');
        tasks.push({
          id: snap.key,
          name: snap.val().name,
          date: snap.val().date,
          category: snap.val().category,
          description: snap.val().description,
          budget: snap.val().budget
        });
        return false;
      });
      this.taskList = tasks;
      this.loadedTaskList = tasks;
    });
  }

  goToTaskDetail(taskId):void{
    this.navCtrl.push('TaskDetailPage', {taskId: taskId});
  }

  getItems(searchbar) {
    this.initializeItems();
    var q = searchbar.target.value;

    if(!q) {
      return;
    }

    this.taskList = this.taskList.filter((v) => {
      if(v.name && q) {
        if(v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.taskList.length);
  }

  postTask(){
    console.log('pressed');
    this.navCtrl.push('TaskCreatePage');
  }
}
