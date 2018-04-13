import { Component } from '@angular/core';
import { ViewController,IonicPage, NavController, NavParams, ModalController
 } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";

/**
 * Generated class for the TaskFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-filter',
  templateUrl: 'task-filter.html',
})
export class TaskFilterPage {
  public taskCategory: Array<any>;
  public address;
  public distance;
  public range;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public taskProvider: TaskProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  ) {
    this.address = {
      place: '',
      latitude: '',
      longitude:''
     };
     this.distance = `5`;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskFilterPage');
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

  showAddressModal () {
    let modal = this.modalCtrl.create('AutoCompletePage');
    // let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data.address;
      this.address.latitude = data.latitude;
      this.address.longitude = data.longitude;
    });
    modal.present();
  }

  applyFilter(taskCat, min, max, type, hide){
    this.viewCtrl.dismiss({taskCat: taskCat, lat:this.address.latitude , lng: this.address.longitude, distance: this.distance, max: max, min: min, type: type, hide:hide});
  }

  showDistance (e){
    switch(this.range) {
      case 1:
          this.distance = `5`;
          break;
      case 2:
          this.distance = `10`
          break;
      case 3:
          this.distance = `15`;
          break;
      case 4:
          this.distance = `25`
          break;
      case 5:
          this.distance = `50`;
          break;
      case 6:
          this.distance = `50+`
          break;
      default:
         this.distance = `5`
    } 
  }
}
