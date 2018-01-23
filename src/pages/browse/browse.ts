import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";

/**
 * Generated class for the BrowsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {
  public taskCategory: Array<any>;

  constructor(
    public navCtrl: NavController, 
    public taskProvider: TaskProvider
  ) {}

  ionViewDidLoad() {
    this.taskProvider.getTaskCategory().on("value", taskCategorySnapshot => {
      this.taskCategory = [];
      taskCategorySnapshot.forEach(snap => {
        console.log('ionViewDidLoad Browse category');
        this.taskCategory.push({
          id: snap.key,
          name: snap.val().name,
          icon: snap.val().icon
        });
        return false;
      });
    });
  }

  postTask(){
    console.log('pressed');
    this.navCtrl.push('TaskCreatePage');
  }

  browseTask(categoryId){
    console.log('pressed');
    this.navCtrl.push('TaskListPage', {categoryId: categoryId});
  }
}
