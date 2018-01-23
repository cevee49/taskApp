import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";

@IonicPage()
@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {
  public address;

  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider,
    private modalCtrl : ModalController
  ) {this.address = {
    place: ''
   };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskCreatePage');
  }

  createTask(
    taskName: string, 
    taskDate: string, 
    taskCategory: string, 
    taskLocation: string,
    taskDescription: string, 
    taskBudget: number
  ): void {
    this.taskProvider
      .createTask(taskName, taskDate, taskCategory, taskLocation, taskDescription, taskBudget)
      .then(newEvent => {
        this.navCtrl.pop()
      });
  }

  showAddressModal () {
    let modal = this.modalCtrl.create('AutoCompletePage');
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
    });
    modal.present();
  }
}
