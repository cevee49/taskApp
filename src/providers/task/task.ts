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
  public candidateList: firebase.database.Reference;
  public currentUser:firebase.User;

  constructor() {
    console.log('Hello TaskProvider Provider');
    this.taskListRef = firebase.database().ref(`taskList`);
    this.taskCategoryRef = firebase.database().ref(`taskCategory`);
    this.candidateList = firebase.database().ref(`candidateList`);
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.currentUser = user;
      }
    })
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
    const userId: string = firebase.auth().currentUser.uid;
    return this.taskListRef.push({
      name: taskName,
      date: taskDate,
      budget: taskBudget ,
      category: taskCategory,
      location: taskLocation,
      description: taskDescription,
      poster: this.currentUser.uid
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

  addCandidate (taskId: string) : PromiseLike<any> {
    const uid = this.currentUser.uid
    const candidate = {[uid]: true};
    return this.taskListRef.child(`${taskId}`).update({candidate})
  }
}
