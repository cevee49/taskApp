import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { ProfileProvider } from "../../providers/profile/profile";

@IonicPage()
@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {
  public address;
  public online ={
    checked :false
  };
  public showLocation;
  public taskCategory: Array<any>;
  x = {};

  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    private modalCtrl : ModalController
  ) {this.address = {
    place: '',
    latitude: '',
    longitude:''
   };
   this.showLocation=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskCreatePage');
    this.taskProvider.getTaskCategory().on("value", taskCatSnapshot => {
      this.taskCategory = [];
      taskCatSnapshot.forEach(snap => {
        this.taskCategory.push({
          id: snap.key,
          name: snap.val().name
        });
        return false;
      });
    });
  }

  createTask(
    taskName: string, 
    taskDate: string, 
    taskCategory: string, 
    // taskLocation: string,
    taskDescription: string, 
    taskBudget: number,
    taskerNumber: number
  ): void {
    console.log(taskerNumber);
    this.taskProvider
      .createTask(taskName, taskDate, taskCategory,this.address, taskDescription, taskBudget, taskerNumber)
      .then(newEvent => {
        this.navCtrl.pop()
      });
  }

  showAddressModal () {
    let modal = this.modalCtrl.create('AutoCompletePage');
    // let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data.address;
      this.address.latitude = data.latitude;
      this.address.longitude = data.longitude;
      console.log(this.address);
    });
    modal.present();
  }

  updateOnline(e){
    console.log(e.currentTarget.checked);
    if(e.currentTarget.checked) {
     this.showLocation = true;
  }
}
}
