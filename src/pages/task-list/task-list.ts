import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController  } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { LocationProvider } from "../../providers/location/location";
import { FormControl } from '@angular/forms';
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
  searching: any = false;


  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider,
    public locationProvider: LocationProvider,
    public modalCtrl: ModalController
  ) {}

  initializeItems():void {
    this.taskList = this.loadedTaskList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskListPage');
    this.taskProvider.getTaskList().on("value", taskListSnapshot => {
      let tasks = [];
      taskListSnapshot.forEach(snap => {
        tasks.push({
          id: snap.key,
          name: snap.val().name,
          date: snap.val().date,
          category: snap.val().category,
          location: snap.val().location.place,
          lat :snap.val().location.latitude,
          lng :snap.val().location.longitude,
          description: snap.val().description,
          budget: parseInt(snap.val().budget), 
          taskerNumber: snap.val().taskerNumber,
        });
        
        return false;
      });
      this.taskList = tasks;
      this.loadedTaskList = tasks;   
    })
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

  openFilter(){
    let modal = this.modalCtrl.create('TaskFilterPage');
    modal.onDidDismiss(data => {
      const taskCat = data.taskCat;
      const lat = data.lat;
      const lng = data.lng;
      const type = data.type;
      const hide = data.hide;
      const min = data.min;
      const max = data.max;
      const distance = data.distance;
      
      this.taskList = this.loadedTaskList.filter((v) => {
        
        if(v.category && taskCat != "All categories") {
          if(v.category !=taskCat  ) {
            return false;
          }
        }
        if(v.location && type != `All`){
          if((type===`Online` && v.location!=`online`) ||(type===`In person` && v.location ===`online`) ){
            return false;
          }
        }
        console.log(this.locationProvider.applyHaversine(v.lat,v.lng, lat, lng));
        if(v.lat &&v.lng && distance != `50+`) {
            if(this.locationProvider.applyHaversine(v.lat,v.lng, lat, lng)>distance) {
                return false;
          }  
        }
        if(v.budget!= null){
          if(v.budget<min || v.budget>max){
            return false;
          }
        }
        if(v.taskerNumber !=null && hide){
          if(v.taskerNumber==0){
            return false;
          }
        }
        return true;
      });
       
      
      
    });
    modal.present();
  
 

    // this.taskList = this.taskList.filter((v) => {
    //   if(v.lat &&v.lng) {
    //     if(this.locationProvider.applyHaversine(v.lat,v.lng, lat, lng)<50) {
    //       return true;
    //     }
    //     return false;
    //   }
    // });

  }

  postTask(){
    this.navCtrl.push('TaskCreatePage');
  }

  openChatlist(){
    this.navCtrl.push('ChatListPage');
  }
}
