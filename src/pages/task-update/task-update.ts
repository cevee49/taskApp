import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Generated class for the TaskUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-update',
  templateUrl: 'task-update.html',
})
export class TaskUpdatePage {
  public currentTask: any= {};
  public address;
  public online ={
    checked :false
  };
  public showLocation;
  public taskCategory: Array<any>;
  x = {};
  public updateTaskForm: FormGroup;
  public today: String;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    private modalCtrl: ModalController,
    formBuilder: FormBuilder
  ) {
    this.address = {
      place: '',
      latitude: '',
      longitude:''
     };
     this.showLocation=false;
     this.updateTaskForm = formBuilder.group({
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
    console.log('ionViewDidLoad TaskUpdatePage');
    this. taskProvider
    .getTaskDetail(this.navParams.get("taskId"))
    .once("value", taskSnapshot => {
      if(taskSnapshot!=null){
      this.currentTask = taskSnapshot.val();
      this.currentTask.id = taskSnapshot.key;
      this.updateTaskForm.controls['taskDate'].setValue(taskSnapshot.val().date) ;
      this.updateTaskForm.controls['taskCat'].setValue(taskSnapshot.val().category) ; 
      this.updateTaskForm.controls['taskName'].setValue(taskSnapshot.val().name) ;
      this.updateTaskForm.controls['taskDescription'].setValue(taskSnapshot.val().description) ;
      this.updateTaskForm.controls['taskBudget'].setValue(taskSnapshot.val().budget) ;
      this.updateTaskForm.controls['taskerNumber'].setValue(taskSnapshot.val().taskerNumber) ;
      if(taskSnapshot.val().location.place === "Online"){
        this.updateTaskForm.controls['taskOnline'].setValue(true);
      }
      this.updateTaskForm.controls['taskAddress'].setValue(taskSnapshot.val().location.place) ;
      this.address.place = taskSnapshot.val().location.place;
      this.address.latitude = taskSnapshot.val().location.latitude;
      this.address.longitude = taskSnapshot.val().location.longitude;
      }
      
    });
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
  }

  updateTask(
    // taskName: string, 
    // taskDate: string, 
    // taskCategory: string, 
    // // taskLocation: string,
    // taskDescription: string, 
    // taskBudget: number,
    // taskerNumber: number
  ): void {
    if (!this.updateTaskForm.valid) {
      this.updateTaskForm.controls['taskName'].markAsDirty();
      console.log(
       `Need to complete the form, current value: ${this.updateTaskForm.value}`
      );
    } else {
    const taskName: string = this.updateTaskForm.value.taskName;
    const taskDate: string = this.updateTaskForm.value.taskDate;
    const taskCat: string = this.updateTaskForm.value.taskCat;
    // const taskAddress: string = this.createTaskForm.value.taskAddress;
    const taskDescription: string = this.updateTaskForm.value.taskDescription;
    const taskBudget: number = this.updateTaskForm.value.taskBudget;
    const taskerNumber: number = this.updateTaskForm.value.taskerNumber;
    this.taskProvider
      .updateTask(this.currentTask.id, taskName, taskDate, taskCat,this.address, taskDescription, taskBudget, taskerNumber)
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
      this.updateTaskForm.controls['taskAddress'].setValue(data.address) ;
      this.address.place = data.address;
      this.address.latitude = data.latitude;
      this.address.longitude = data.longitude;
      }
    });
    modal.present();
  }
}

