import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the TaskProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskProvider {

  public taskListRef: firebase.database.Reference;
  public taskCategoryRef: firebase.database.Reference;

  constructor() {
    console.log('Hello TaskProvider Provider');
    // firebase.auth().onAuthStateChanged(user => {
    //   if(user) {
    //     this.currentUser = user;
      this.taskListRef = firebase.database().ref(`taskList`);
      this.taskCategoryRef = firebase.database().ref('taskCategory');
    //   }
    // })
  }

  createTask(
    taskName: string, 
    taskDate: string, 
    taskCategory: string, 
    taskLocation: string,
    taskDescription: string, 
    taskBudget: number,
    // taskPoster: string
  ): firebase.database.ThenableReference {
    return this.taskListRef.push({
      name: taskName,
      date: taskDate,
      budget: taskBudget ,
      category: taskCategory,
      location: taskLocation,
      description: taskDescription,
      poster: firebase.auth().currentUser.uid
    })
  }

  getTaskList(): firebase.database.Reference {
    return this.taskListRef;
  }

  getTaskCategory(): firebase.database.Reference {
    return this.taskCategoryRef;
  }

  getTaskDetail(taskId:string): firebase.database.Reference {
    return this.taskListRef.child(taskId);
  }
}
