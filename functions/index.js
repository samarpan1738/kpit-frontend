const functions = require('firebase-functions');
const admin=require('firebase-admin');

admin.initializeApp();

exports.addAdminRole=functions.https.onCall((data,context)=>{
    // check request is made by an admin
    // if ( context.auth.token.admin !== true ) 
    // {
    //     return { error: 'Only admins can add other admins' }
    // }
    //Get the user and add a custom claim (admin)
    return admin.auth().getUserByEmail(data.email).then((user)=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin:true
        }).then(()=>{
            return{
                message:`Successfully added ${data.email} as admin!!`
            }
        }).catch(err=>err)
    })
})

exports.bookSlot=functions.https.onCall((data,context)=>{
    // check request is made by an admin
    // if ( context.auth.token.admin !== true ) 
    // {
    //     return { error: 'Only admins can add other admins' }
    // }
    //Get the user and add a custom claim (admin)
    return admin.auth().getUserByEmail(data.email).then((user)=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin:true
        }).then(()=>{
            return{
                message:`Successfully added ${data.email} as admin!!`
            }
        }).catch(err=>err)
    })
})