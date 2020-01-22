
currentUser={};

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) 
  {
    currentUser=user
    user.getIdTokenResult().then(idTokenResult => 
      {
        console.log("on auth state change "+idTokenResult.claims.admin)
        user.admin = idTokenResult.claims.admin;
        setupUI(user);
      });
    // if(user.admin && user.admin == true)
    // {
    //   console.log(user)
    //   // db.collection('locations/user.uid').onSnapshot(
    //   //   snapshot => 
    //   //   {
    //   //     setupGuides(snapshot.docs,user);
    //   //   }, 
    //   //   err => console.log(err.message)
    //   //   );
    // }
    // else
    // {
      db.collection('locations').onSnapshot(
      snapshot => 
      {
        setupGuides(snapshot.docs,user);
      }, 
      err => console.log(err.message)
      );
    }
  // } 
  else 
  {
    setupUI();
    setupGuides([]);
  }
});
//Setup Locations for admin

// Location setup
const setupForm = document.querySelector('#setup-form');
setupForm.addEventListener('submit', (e) => 
        {
          e.preventDefault();
          //Add to firestore and handle THEN and CATCH
            db.collection('locations').add(
              {
                name: setupForm.name.value,
                adminId:currentUser.email,
                latLng:setupForm.latitude.value+','+setupForm.longitude.value,
                availSlots:0,
                totalSlots:setupForm.totalSlots.value,
                imgUrl:setupForm.imgUrl.value,
                locationId:''
              }).
              then((docRef) => 
              {
                  M.toast({html: "Successfully added a location."})
                  const modal = document.querySelector('#modal-create');
                  M.Modal.getInstance(modal).close();
                  setupForm.reset();
                  // close the create modal & reset form
                  // docRef.collection('bookings')
            //       .then(()=>console.log('Booking subcollectios added'))
            //         .catch((e)=>console.log('error adding subcollection'))
            // }).catch(err => {
            //   console.log(err.message);
            // });
            
        }
);})
// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const isAdmin=signupForm['signup-role'].checked;
  const name=signupForm['signup-name'].value
  const number=signupForm['signup-number'].value
  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      emailId:email,
      mobileNo:number,
      name:name,
      totalBookings:0
      
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = ''
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
  if(isAdmin)
  {
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: email }).then(result => {console.log(result);}).catch(e=>console.log(e))
  }
});

//Book a slot
const bookForm = document.querySelector('#book-form');
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log("Booking location --> "+booking_provider)  
  // get user info
  // const time = signupForm['booking-time'].value;
  let book_time=document.querySelector('input[type="time"]').value;
  db.collection('locations').where("adminId","==",booking_provider).get().then((query)=>{
    if(query)
    {
        let data=query.docs[0].data()
        console.log("Document's data: ",data)
        let admin_id=query.docs[0].id
        let updatedSlots=(data.availSlots)-1
        let d=new Date(Date());
        let currentTime=d.getHours()+':'+(parseInt(d.getMinutes())<=9?'0'+d.getMinutes():d.getMinutes());
        if(book_time>=currentTime)
        {
            console.log("Current User uid --> "+currentUser.uid)
            db.collection('locations').doc(admin_id).update({availSlots:updatedSlots})
            db.collection(`locations/${admin_id}/bookings`).add(
              {
                arrivalTime:book_time,
                bookedTime:currentTime,
                booking_status:'Confirmed',
                orderId:0,
                penalty:0,
                slots:1
              }
            ).then((docRef)=>M.toast({html: "Booking added in bookings subcollection"})).catch(function(error) {
              console.log("Error getting documents: ", error);
              })
            


            //Clean-Up
            const modal = document.querySelector('#modal-book');
            M.Modal.getInstance(modal).close();
            bookForm.reset();
      }
      else
      {
        bookForm.querySelector('.error').innerHTML = `Enter a time greater than current time(${currentTime})`;
      }
    }
    else{
      console.log("Not found")
    }
  })
})
// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  M.toast({html: "Logged Out"})
  auth.signOut();
  currentUser={};
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    console.log(cred)
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
    M.toast({html: "Logged In"})
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });

});