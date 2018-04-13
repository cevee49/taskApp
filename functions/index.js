const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendMessage = functions.database
    .ref('/chatroom/{userId}/{chatId}')
    .onWrite((change, context) => {
        console.log("test");
        const chatId = context.params.chatId;
        const userId = context.params.userId;
        const buddyId = change.after.val().buddyId;
        const sender = change.after.val().sender;
        // const msg = event.data.val()
        // console.log(sender, userId);
        if(sender!==userId){
            return admin
            .database()
            .ref(`/userProfile/${sender}/`)
            .once('value', buddySnapshot => {
                const buddyFirstName = buddySnapshot.val().firstName;
                const buddyLastName = buddySnapshot.val().lastName;
                var buddyFullName = buddyFirstName +` `+ buddyLastName.charAt(0) + `.`;
                return admin
                    .database()
                    .ref(`/userProfile/${userId}`)
                    .once('value', profileSnapshot => {
                        const payload = {
                            notification: {
                            title: `${buddyFullName} just messaged you`,
                            body: `${buddyFullName} just messaged you`,
                            sound: 'default',
                            click_action: 'FCM_PLUGIN_ACTIVITY'
                            },
                            // data: { chatId: chatId }
                        };

                        // admin.database().ref(`/notification/${userId}/`).push({
                        //         detail: buddyFullName + "just messaged you"
                        //    })
                    
                            return admin
                                .messaging()
                                .sendToDevice(profileSnapshot.val().token, payload);
                        
                    });
            });
        } else {
            return;
        }
        
    });

exports.makeOffer = functions.database
.ref('/candidateList/{taskId}/{userId}')
.onCreate((snap, context) => {
    console.log("test");
    const taskId = context.params.taskId;
    const userId = context.params.userId;

        return admin
        .database()
        .ref(`/userProfile/${userId}/`)
        .once('value', buddySnapshot => {
            const buddyFirstName = buddySnapshot.val().firstName;
            const buddyLastName = buddySnapshot.val().lastName;
            var buddyFullName = buddyFirstName +` `+ buddyLastName.charAt(0) + `.`;
            return admin
            .database()
            .ref(`/taskList/${taskId}/`)
            .once('value', taskSnapshot => {
                const posterId = taskSnapshot.val().poster;
                const taskName = taskSnapshot.val().name;
                return admin
                .database()
                .ref(`/userProfile/${posterId}`)
                .once('value', profileSnapshot => {
                    const payload = {
                        notification: {
                        title: `New Offer for ${taskName}`,
                        body: `${buddyFullName} just made an offer`,
                        sound: 'default',
                        click_action: 'FCM_PLUGIN_ACTIVITY'
                        },
                        // data: { chatId: chatId }
                    };
                    admin.database().ref(`/notification/${posterId}/`).push({
                        detail: buddyFullName + "just made an offer for" + taskName,
                        type: "task",
                        taskId: taskId,
                        createdAt: 0- Date.now()
                     })
                    return admin
                        .messaging()
                        .sendToDevice(profileSnapshot.val().token, payload);
                    
                });
            });
        });
    // } else {
    //     return;
    // }
    
});

exports.assignTasker = functions.database
.ref('/candidateList/{taskId}/{userId}')
.onUpdate((change, context) => {
    console.log("test");
    const taskId = context.params.taskId;
    const userId = context.params.userId;
    const status = change.after.val().status;
    const completed = change.after.val().completed;

    if(status==="tasker" && !completed){
        return admin
        .database()
        .ref(`/taskList/${taskId}/`)
        .once('value', taskSnapshot => {
            const posterId = taskSnapshot.val().poster;
            const taskName = taskSnapshot.val().name;
            return admin
            .database()
            .ref(`/userProfile/${userId}`)
            .once('value', profileSnapshot => {
                const payload = {
                    notification: {
                    title: `Congratulations `,
                    body: `You have been assign to do ${taskName}`,
                    sound: 'default',
                    click_action: 'FCM_PLUGIN_ACTIVITY'
                    },
                    // data: { chatId: chatId }
                };
                admin.database().ref(`/notification/${userId}/`).push({
                    detail: "You have been assign to do" + taskName,
                    type: "task",
                    taskId: taskId,
                    createdAt: 0- Date.now()
                 })

                return admin
                    .messaging()
                    .sendToDevice(profileSnapshot.val().token, payload);
                
            });
        });
    } else {
        return;
    }
    
});

exports.giveReview = functions.database
.ref('/candidateList/{taskId}/{userId}')
.onUpdate((change, context) => {
    console.log("test");
    const taskId = context.params.taskId;
    const userId = context.params.userId;
    const completed = change.after.val().completed;
    const review = change.after.val().review;

    if(completed && !review){
        return admin
        .database()
        .ref(`/taskList/${taskId}/`)
        .once('value', taskSnapshot => {
            const posterId = taskSnapshot.val().poster;
            const taskName = taskSnapshot.val().name;
            return admin
            .database()
            .ref(`/userProfile/${userId}`)
            .once('value', profileSnapshot => {
                const payload = {
                    notification: {
                    title: `Congratulations, ${taskName} completed! `,
                    body: `Leave you review!`,
                    sound: 'default',
                    click_action: 'FCM_PLUGIN_ACTIVITY'
                    },
                    // data: { chatId: chatId }
                };
                admin.database().ref(`/notification/${userId}/`).push({
                    detail: "Congratulations,"+ taskName +" completed! Leave you review!",
                    type: "review",
                    createdAt: 0- Date.now()
                 })
                return admin
                    .messaging()
                    .sendToDevice(profileSnapshot.val().token, payload);
                
            });
        });
    } else {
        return;
    }
    
});

exports.getReview = functions.database
.ref('/review/{userId}/{reviewType}/{taskId}')
.onWrite((change, context) => {
    console.log("test");
    // const taskId = context.params.taskId;
    const userId = context.params.userId;
    const type = context.params.reveiewType;
    const reviewer = change.after.val().posterId;

    // if(completed){
        return admin
        .database()
        .ref(`/userProfile/${reviewer}/`)
        .once('value', buddySnapshot => {
            const buddyFirstName = buddySnapshot.val().firstName;
            const buddyLastName = buddySnapshot.val().lastName;
            var buddyFullName = buddyFirstName +` `+ buddyLastName.charAt(0) + `.`;
            return admin
            .database()
            .ref(`/userProfile/${userId}`)
            .once('value', profileSnapshot => {
                const payload = {
                    notification: {
                    title: `${buddyFullName} left you a review `,
                    body: `${buddyFullName} left you a review`,
                    sound: 'default',
                    click_action: 'FCM_PLUGIN_ACTIVITY'
                    },
                    // data: { chatId: chatId }
                };
                if(type === "tasker"){
                    admin.database().ref(`/notification/${userId}/`).push({
                        detail: buddyFullName+ " left you a review",
                        type: "review",
                        createdAt: 0- Date.now()
                     })
                }

                return admin
                    .messaging()
                    .sendToDevice(profileSnapshot.val().token, payload);
                
            });
        });
    // } else {
    //     return;
    // }
    
});