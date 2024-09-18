const urlBase = 'http://cop433117.xyz/LAMPAPI';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userID = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";
	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {

			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userID = jsonObject.id;

				if (userID < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect!!!";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "UI.html";
				searchContacts();
			}
			else if(this.readyState==4&& this.status==400){
				var element= document.getElementById("notification");
				var mess = document.getElementById("loginResult");
				element.style.display="flex";
				element.style.animation = 'slideDown 400ms ease forwards'; // Apply the animation
    			mess.innerHTML = "User/Password combination incorrect!!!";
			}
		};
		xhr.send(jsonPayload);

	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
function doSignup() {
	let login = document.getElementById("login").value;
	let password = document.getElementById("password").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;

	let tmp = { login: login, password: password, firstName: firstName, lastName: lastName };

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && this.status == 409) {
				document.getElementById("registerResult").innerHTML = "Invalid username!!!";
			}
			else if (xhr.readyState == 4 && this.status == 200) {
				document.getElementById("registerResult").innerHTML = "Successful!!!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}


}
function back() {
	window.location.href = "http://cop433117.xyz";
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userID + ";expires=" + date.toGMTString();
}

function readCookie() {
	userID = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userID = parseInt(tokens[1].trim());
		}
	}

	if (userID < 0) {
		window.location.href = "index.html";
	}
	else {
		//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userID = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContacts() {
	
	let newFirst = document.getElementById("firstName").value;
	let newLast = document.getElementById("lastName").value;
	let newEmail = document.getElementById("email").value;
	let newPhone = document.getElementById("phone").value;
	let userId = userID;
	
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = { firstName: newFirst, lastName: newLast, phone: newPhone, email: newEmail, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = 'http://cop433117.xyz/LAMPAPI/AddContacts.php';

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var element=document.getElementById("addNoti");
				element.style.display="flex";
				element.style.backgroundColor="rgba(0,255, 30, 0.6)";
				element.style.animation='slideUp 400ms ease forwards';
				document.getElementById("contactAddResult").innerHTML = "Success to add";
				searchContacts();
			}
			else if (this.readyState ==4 && this.status == 409) {
				var element=document.getElementById("addNoti");
				element.style.display="flex";
				element.style.backgroundColor="rgba(255,0, 0, 0.6)";
				element.style.animation='slideUp 400ms ease forwards';
				document.getElementById("contactAddResult").innerHTML = "Contact already exist";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = "Fail to add";
	}

}

function searchContacts() {
	let srch = document.getElementById("searchContact").value;
	document.getElementById("resultWindow").innerHTML="";
	//let colorList = "";

	let tmp = { search: srch, userId: userID };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {


				let jsonObject = JSON.parse(xhr.responseText);
				let container = document.getElementById("resultWindow");
				for (let i = 0; i < jsonObject.results.length; i++) {

					let newDiv = document.createElement('div');
					newDiv.className = "searchResults";
					newDiv.id=i;

					let name = document.createElement('p');
					name.textContent = "Name: " + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName;

					let phone = document.createElement('p');
					phone.textContent = "Phone: " + jsonObject.results[i].Phone;

					let email = document.createElement('p');
					email.textContent = "Email: " + jsonObject.results[i].Email;

					let del = document.createElement('i');
					//del.innerHTML = "&#128465;";
					del.classList.add("bx", "bxs-trash");

					let contactId = jsonObject.results[i].ID;

					del.addEventListener('click', function () {
						deleteContacts(contactId,i);

					});

					let ed = document.createElement('i');
					//ed.innerHTML = "&#9998;";
					ed.classList.add("bx", "bxs-edit");

					ed.addEventListener('click', function () {

						document.querySelector('.popEditDiv').style.display = 'flex';

						document.getElementById("EditContact").onclick = function () {
							updateContacts(contactId);
						};

					});

					newDiv.appendChild(name);
					newDiv.appendChild(phone);
					newDiv.appendChild(email);
					newDiv.appendChild(ed);
					newDiv.appendChild(del);

					container.appendChild(newDiv);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}


function updateContacts(contactId) {

	let efirstName = document.getElementById("efirstName").value;
	let elastName = document.getElementById("elastName").value;
	let ephone = document.getElementById("ephone").value;
	let eemail = document.getElementById("eemail").value;

	let tmp = { id: contactId, userId: userID, firstName: efirstName, lastName: elastName, phone: ephone, email: eemail };

	document.getElementById("contactEditResult").innerHTML = "";

	let jsonPayload = JSON.stringify(tmp);

	let url = 'http://cop433117.xyz/LAMPAPI/UpdateContacts.php';

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactEditResult").innerHTML = "Updated!";
				searchContacts();

			} else {
				document.getElementById("contactEditResult").innerHTML = "Failed to Update";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactEditResult").innerHTML = "Failed to Update";
	}
}



function deleteContacts(contactId,divID) {
	let confirmDeletion = confirm("Are you sure you want to delete this contact?");
	if (confirmDeletion) {

		let tmp = {
			id: contactId,
			userId: userID
		};

		let jsonPayload = JSON.stringify(tmp);

		let url = 'http://cop433117.xyz/LAMPAPI/DeleteContacts.php';

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				alert('Contact deleted ^_^');
			}
		};
		document.getElementById(divID).style.display="none";
		
		xhr.send(jsonPayload);
	}
}




var b;
function passSi() {

	if (b == 1) {
		document.getElementById('password').type = 'password';
		document.getElementById('togglePassword').className = 'far fa-eye-slash';
		b = 0;
	}
	else {
		document.getElementById('password').type = 'text';
		document.getElementById('togglePassword').className = 'far fa-eye';
		b = 1;
	}
}
var a;
function pass() {

	if (a == 1) {
		document.getElementById('loginPassword').type = 'password';
		document.getElementById('togglePassword').className = 'far fa-eye-slash';
		a = 0;
	}
	else {
		document.getElementById('loginPassword').type = 'text';
		document.getElementById('togglePassword').className = 'far fa-eye';
		a = 1;
	}
}

function formatPhone(value){
	if(!value) return value;
	const phoneNumber = value.replace(/[^\d]/g,'');
	const phoneLength = phoneNumber.length;
	if(phoneLength<4) return phoneNumber;
	if(phoneLength<7){
		return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3)}`;
	}
	return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,9)}`;
}

function phoneFormatter(){
	const input = document.querySelector(".phoneNume");
	const formatted=formatPhone(input.value);
	input.value = formatted;
}

function resetNoti(){
	var element= document.getElementById("addNoti");
	var mess = document.getElementById("contactAddResult");
	mess.innerHTML="";
	element.style.display="none";
}
