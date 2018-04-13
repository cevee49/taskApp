import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  ModalController, 
  Loading,
  LoadingController, 
  Events
} from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { ProfileProvider } from "../../providers/profile/profile";
import { LocationProvider } from "../../providers/location/location";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  public filterForm: FormGroup;
  public posterimg: any;
  public loading: Loading=null ;
  badge: number = 1;

  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider,
    public profileProvider: ProfileProvider,
    public locationProvider: LocationProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public events: Events,
    formBuilder: FormBuilder
  ) {
    
  }

  initializeItems():void {
    this.taskList = this.loadedTaskList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskListPage');
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    setTimeout(() => {
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
    }, 10000);
    this.taskProvider.getTaskList().on("value", taskListSnapshot => {
      let tasks = [];
      taskListSnapshot.forEach(snap => {
        this.profileProvider.getOtherProfile(snap.val().poster).on("value", userProfileSnapshot => {
          this.posterimg = userProfileSnapshot.val().photo;
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
            assignNumber: snap.val().assignNumber,
            completedNumber: snap.val().completedNumber,
            status:snap.val().status,
            posterimg :userProfileSnapshot.val().photo
          });
        })
        
        return false;
      });
      this.taskList = tasks;
      this.loadedTaskList = tasks;   
      if(this.loading != null){
        this.loading.dismiss();
        this.loading =null;
      }
    })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.ionViewDidLoad();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      const taskCat = data.taskCat;
      const lat = data.lat;
      const lng = data.lng;
      const type = data.type;
      const hide = data.hide;
      const min = data.min;
      const max = data.max;
      const distance = data.distance;
      this.taskList = this.loadedTaskList.filter((v) => {       
        if(v.category && taskCat != "All categories" ) {
          if(v.category !=taskCat  ) {
            return false;
          }
        }
        if(v.location && type != `All` ){
          if((type===`Online` && v.location!=`Online`) ||(type===`In person` && v.location ===`Online`) ){
            return false;
          }
        }
        if(v.lat &&v.lng && distance != `50+` && lat && lng) {
            if(this.locationProvider.applyHaversine(v.lat,v.lng, lat, lng)>distance) {
                return false;
          }  
        }
        if(v.budget!= null && min!=null && max!=null){
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
      this.loading.dismiss();
    });
    modal.present();
  }

  postTask(){
    this.navCtrl.push('TaskCreatePage');
  }

  openNotif(){
    this.navCtrl.push('NotificationListPage',  {}, {animate: true, direction: `back`});
  }
}
