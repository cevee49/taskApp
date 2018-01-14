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

  constructor() {
    console.log('Hello TaskProvider Provider');
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.taskListRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/taskList`);
      }
    })
  }

  createTask(
    taskName: string,
    taskDate: string,
    taskLocation: string,
    taskPay: number,
    taskAssigned: boolean
  ): firebase.database.ThenableReference {
    return this.taskListRef.push({
      name: taskName,
      date: taskDate,
      location: taskLocation,
      pay: taskPay ,
      assign: taskAssigned
    })
  }

  getTaskList(): firebase.database.Reference {
    return this.taskListRef;
  }

  getTaskDetail(taskId:string): firebase.database.Reference {
    return this.taskListRef.child(taskId);
  }
}
