// DOM elements
const guideList = document.querySelector(".guides");
const welcomeScreen = document.querySelector("#welcome-screen");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");
let booking_provider = "";
const setupUI = (user) => {
	if (user) {
		if (user.admin) {
			adminItems.forEach((item) => (item.style.display = "block"));
		}
		// account info
		db.collection("users")
			.doc(user.uid)
			.get()
			.then((doc) => {
				const data = doc.data();
				const html = `
          <div>Logged in as  <span class="purple-text flow-text text-lighten-2">${
						data.name
					}</span></div>
          <div>${data.emailId}</div>
          <div>${data.mobileNo}</div>
          <div class="pink-text">${user.admin ? "Admin" : ""}</div>
        `;
				accountDetails.innerHTML = html;
			});
		// toggle user UI elements
		loggedInLinks.forEach((item) => (item.style.display = "block"));
		loggedOutLinks.forEach((item) => (item.style.display = "none"));
	} else {
		// clear account info
		accountDetails.innerHTML = "";
		// toggle user elements
		adminItems.forEach((item) => (item.style.display = "none")); //Hide admin items
		loggedInLinks.forEach((item) => (item.style.display = "none")); //Hide links which are visible only when logged in
		loggedOutLinks.forEach((item) => (item.style.display = "block")); //Show all items for offline mode
	}
};
// setup guides
const setupGuides = (data, user) => {
	// data = Array of docs
	if (data.length) {
		//&& !user.admin)
		let html = "";
		data.forEach((doc) => {
			// <li>
			//     <div class="collapsible-header grey lighten-4"> ${location.name} </div>
			//     <div class="collapsible-body white">
			//       <div>Available Slots : ${location.availSlots}</div>
			//       <div>Total Slots : ${location.totalSlots}</div>
			//     </div>
			//   </li>
			const location = doc.data();
			const li = `
            
            <div class="col s12 m12">
              <div class="card">
                <div class="card-image">
                <div class="card-title black-text text-darken-10 center-align" style="position:relative;margin:0;padding:5px 24px 5px;font-size:2rem;letter-spacing:2px;">${location.name}</div>
                <img src="${location.imgUrl}" style="width:99%;height:65vh;margin:0 auto 0;">
                </div>
                <div class="card-content row valign-wrapper">
                <div class="col s12 m6">
                  <div class="" style="font-size:1.3rem;">Available Slots : ${location.availSlots}</div>
                  <div class="" style="font-size:1.3rem;">Total Slots : ${location.totalSlots}</div>
                </div>
                <div class="col s12 m6 right-align">
                  <a href="#" class="modal-trigger waves-effect waves-light btn yellow lighten black-text book_btn" data-target="modal-book" id="${location.adminId}">Book Slot</a>
                </div>
                </div>
              </div>
            </div>
          
          `;
			html += li;
		});
		welcomeScreen.innerHTML = "";
		guideList.innerHTML = html;
		let book_btns = document.querySelectorAll(".book_btn");
		book_btns.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				booking_provider = e.toElement.id;
			});
		});
	}
	// else if(user && user.admin)
	// {
	//   guideList.innerHTML = '<h5 class="center-align">You are an admin.</h5>';
	// }
	else {
		guideList.innerHTML = "";
		welcomeScreen.innerHTML = `
    <div class="welcome-container">
    <div class="welcome-text">
      <h1  class="welcome-heading">Park It</h1>
      <p class="welcome-subheading">Check. Book. Enjoy.</p>
     <div class="welcome-search-container">
      <input type="text" id="welcome-input" placeholder="Enter location">
      <button>Search</button>
     </div>
    </div>
    <div>
      <img src="./landing_illustration.svg" class="welcome-img">
    </div>
  </div>`;
	}
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
	var modals = document.querySelectorAll(".modal");
	M.Modal.init(modals);

	var items = document.querySelectorAll(".collapsible");
	M.Collapsible.init(items);
});
