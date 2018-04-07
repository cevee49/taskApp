import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { ProfileProvider } from "../../providers/profile/profile";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
  public createTaskForm: FormGroup;
  public today: String;

  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    private modalCtrl : ModalController,
    formBuilder: FormBuilder
  ) {
    this.address = {
    place: '',
    latitude: '',
    longitude:''
   };
   this.showLocation=false;
   this.createTaskForm = formBuilder.group({
     taskName : [
       "",
       Validators.compose([Validators.required])
     ],
     taskCat  : [
      "",
      Validators.compose([Validators.required])
    ],
     taskDescription : [
      "",
      Validators.compose([Validators.required])
    ],
     taskAddress: [
      "",
      Validators.compose([Validators.required])
    ],
     taskBudget: [
      "",
      Validators.compose([Validators.required])
    ],
     taskerNumber: [
      1,
      Validators.compose([Validators.required])
    ],
     taskDate: [
      "",
      Validators.compose([Validators.required])
    ],
    taskOnline: [
      false
    ],
   })
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
    this.today =new Date().toISOString();
    this.createTaskForm.controls['taskDate'].setValue(this.today) ;
    
  }

  createTask(
    // taskName: string, 
    // taskDate: string, 
    // taskCategory: string, 
    // // taskLocation: string,
    // taskDescription: string, 
    // taskBudget: number,
    // taskerNumber: number
  ): void {
    if (!this.createTaskForm.valid) {
      this.createTaskForm.controls['taskName'].markAsDirty();
      console.log(
       `Need to complete the form, current value: ${this.createTaskForm.value}`
      );
    } else {
    const taskName: string = this.createTaskForm.value.taskName;
    const taskDate: string = this.createTaskForm.value.taskDate;
    const taskCat: string = this.createTaskForm.value.taskCat;
    // const taskAddress: string = this.createTaskForm.value.taskAddress;
    const taskDescription: string = this.createTaskForm.value.taskDescription;
    const taskBudget: number = this.createTaskForm.value.taskBudget;
    const taskerNumber: number = this.createTaskForm.value.taskerNumber;
    this.taskProvider
      .createTask(taskName, taskDate, taskCat,this.address, taskDescription, taskBudget, taskerNumber)
      .then(newEvent => {
        this.navCtrl.pop()
      });
    }
  }

  showAddressModal () {
    console.log("showaddressmodal");
    let modal = this.modalCtrl.create('AutoCompletePage');
    // let me = this;
    modal.onDidDismiss(data => {
      if(data!=null){
      this.createTaskForm.controls['taskAddress'].setValue(data.address) ;
      this.address.place = data.address;
      this.address.latitude = data.latitude;
      this.address.longitude = data.longitude;
      }
    });
    modal.present();
  }

  updateOnline(e){
    if(e) {
      this.createTaskForm.controls['taskAddress'].setValue("Online") ;
      this.address.place = "Online";
    }
  }

  
}
