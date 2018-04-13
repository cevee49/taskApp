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
  public userTaskListRef: firebase.database.Reference;
  public userTaskOfferRef: firebase.database.Reference;
  public currentUser:firebase.User;
  public candidateRef: firebase.database.Reference;
  public completedRef: firebase.database.Reference;

  constructor() {
    console.log('Hello TaskProvider Provider');
    this.candidateRef = firebase.database().ref(`candidateList`);
    this.taskListRef = firebase.database().ref(`taskList`);
    this.taskCategoryRef = firebase.database().ref(`taskCategory`);
    this.completedRef = firebase.database().ref('taskCompleted');
    this.userTaskOfferRef= firebase.database().ref(`myTaskOffered`);
   
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.userTaskListRef= firebase.database().ref(`myTask/${user.uid}`);
        this.currentUser = user;
      }
    })
  }

  createTask(
    taskName: string, 
    taskDate: string, 
    taskCategory: string, 
    taskLocation: string ,
    taskDescription: string, 
    taskBudget: number,
    taskerNumber: number
    // taskPoster: string
  ): PromiseLike<any> {
    let newTaskKey = this.taskListRef.push().key;
    return this.taskListRef.child(`${newTaskKey}`).update({
      name: taskName,
      date: taskDate,
      budget: taskBudget ,
      category: taskCategory,
      location: taskLocation,
      description: taskDescription,
      taskerNumber: taskerNumber,
      assignNumber: 0,
      completedNumber: 0,
      createdAt: 0- Date.now(),
      poster: this.currentUser.uid
    }).then(()=>{
      this.userTaskListRef.child(`${newTaskKey}`).update({

        createdAt: 0- Date.now(),
        // taskStatus: `OPEN`
      })

    });
  }

  updateTask(
    taskId: string,
    taskName: string, 
    taskDate: string, 
    taskCategory: string, 
    taskLocation: string ,
    taskDescription: string, 
    taskBudget: number,
    taskerNumber: number
    // taskPoster: string
  ): PromiseLike<any> {
    const userId: string = firebase.auth().currentUser.uid;
    // let newTaskKey = this.taskListRef.push().key;
    return this.taskListRef.child(`${taskId}`).update({
      name: taskName,
      date: taskDate,
      budget: taskBudget ,
      category: taskCategory,
      location: taskLocation,
      description: taskDescription,
      taskerNumber: taskerNumber,
      // assignNumber: 0,
      // completedNumber: 0,
      // createdAt: 0- Date.now(),
      // poster: this.currentUser.uid
    });
  }

  deleteTask(taskId: string){
    const uid = this.currentUser.uid;
    // return this.userTaskListRef.child(`${taskId}`).remove();
    return this.taskListRef.child(`${taskId}`).remove().then(()=> {
      console.log("delete");
      return this.userTaskListRef.child(`${taskId}`).remove().then(()=> {
        this.candidateRef.child(`${taskId}`).remove();
      });
        
    });

  }

  getTaskList(): firebase.database.Query {
    return this.taskListRef.orderByChild('createdAt');
  }

  getPostedTaskList(): firebase.database.Query {
    return this.userTaskListRef.orderByChild('createdAt');
  }

  getOfferedTaskList(): firebase.database.Query {
    const uid = this.currentUser.uid;
    return this.userTaskOfferRef.child(`/${uid}`).orderByChild('createdAt');
  }
  getTaskCategory(): firebase.database.Reference {
    return this.taskCategoryRef;
  }

  getTaskDetail(taskId:string): firebase.database.Reference {
    return this.taskListRef.child(taskId);
  }

  addCandidate (poster: string, taskId: string, taskName: string,taskLocation: string, taskDate: string, offerPrice: number) : PromiseLike<any> {
    const uid = this.currentUser.uid;
    const displayName = this.currentUser.displayName;
    
    return this.candidateRef.child(`${taskId}/${uid}`).update({
      // displayName: displayName, 
      offerPrice: offerPrice,
      offeredAt:0- Date.now(),
      status: `candidate`
    }).then(()=>{
        this.userTaskOfferRef.child(`${uid}/${taskId}`).update({

          offeredAt:0- Date.now(),

        })
        // this.userTaskOfferRef.child(`${uid}`).set({[taskId]: true })
      });
    // return this.taskListRef.child(`${taskId}/candidate`).push()
  }
  
  getCandidate (taskId: string): firebase.database.Reference{
    return this.candidateRef.child(`${taskId}`);
  }

  addTasker (taskId: string, taskerId: string) : PromiseLike<any> {
    return this.candidateRef.child(`${taskId}/${taskerId}`).update({
      status: `tasker`,
      completed: false,
      review: false
    })
    // .then(()=>{
    //     this.userTaskOfferRef.child(`${taskerId}/${taskId}`).update({
    //       offeredAt:0- Date.now(),
    //       status: `tasker`,
    //       completed: false
    //     })
    // })
    .then(()=>{
      this.taskListRef.child(`${taskId}`).transaction(task => {
        task.assignNumber += 1;
        return task;
      });
    })
    ;
  }
  
  completeTask(taskId, taskerId): PromiseLike<any>{
    // return this.taskListRef.child(`${taskId}/complete`).update({[taskerId]: true});
    return this.candidateRef.child(`${taskId}/${taskerId}`).update({
      completed: true
    })
    // .then(()=>{
    //     this.userTaskOfferRef.child(`${taskerId}/${taskId}`).update({
    //       offeredAt:0- Date.now(),
    //       completed: true
    //     })
    // })
    .then(()=>{
      this.taskListRef.child(`${taskId}`).transaction(task => {
        task.completedNumber += 1;
        return task;
      });
    })
    ;
  }
}
