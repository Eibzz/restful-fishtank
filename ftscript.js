// How to change CSS via JavaScript
// document.getElementById(id).style.property=new_style

/* DATABASE SCHEMA
CREATE TABLE fish (
	id INTEGER PRIMARY KEY,
	name VARCHAR(64) NOT NULL,
	width INTEGER,
	height INTEGER,
	left INTEGER,
	top INTEGER,
	color VARCHAR(64) NOT NULL
);
*/

// *********** IMPORTANT REMINDERS *************
//input ids are "f(property)" ie. 'fwidth' to prevent confusion with css

//global button references
var btnUpdateTank = document.getElementById("addfish");
var selAction = document.getElementById("faction");
document.getElementById("clear").onclick = function() {clearInput();};

var TANK_WIDTH = 1260;
var TANK_HEIGHT = 710;
var alphanum = /^[a-z0-9]+$/i;
var numeric = /^[0-9]+$/;

var MakeHTTPRequest = function(action, callback) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState == XMLHttpRequest.DONE) {
			if(request.status < 400 && request.status >= 200) {
				callback(request);
			}
			else {
				console.log("Request error.");
			}
		}
	}
	action(request);
};

var addFish = function(request) {
	var fname = document.getElementById("fname").value;
	var fwidth = document.getElementById("fwidth").value;
	var fheight = document.getElementById("fheight").value;
	var fleft = document.getElementById("fleft").value;
	var ftop = document.getElementById("ftop").value;
	var fcolor = document.getElementById("fcolor").value;
	//fwidth and such are strings, but they've already
	//been validated, and strings are great for sending!
	request.open("POST", "http://localhost:8080/fish");
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	request.send(
		"name="+fname+
		"&width="+fwidth+
		"&height="+fheight+
		"&left="+fleft+
		"&top="+ftop+
		"&color="+fcolor
	);
};

var updateFish = function(request) {
	var fid = document.getElementById("fid").value;
	var fname = document.getElementById("fname").value;
	var fwidth = document.getElementById("fwidth").value;
	var fheight = document.getElementById("fheight").value;
	var fleft = document.getElementById("fleft").value;
	var ftop = document.getElementById("ftop").value;
	var fcolor = document.getElementById("fcolor").value;
	var reqString = "";
	if(fname.match(alphanum)) {
		reqString = reqString + "name=" + fname + "&";
	}
	if(fwidth.match(numeric)) {
		reqString = reqString + "width=" + fwidth + "&";
	}
	if(fheight.match(numeric)) {
		reqString = reqString + "height=" + fheight + "&";
	}
	if(fleft.match(numeric)) {
		reqString = reqString + "left=" + fleft + "&";
	}
	if(ftop.match(numeric)) {
		reqString = reqString + "top=" + ftop + "&";
	}
	if(fcolor) {
		reqString = reqString + "color=" + fcolor;
	}
	//fwidth and such are strings, but they've already
	//been validated, and strings are great for sending!
	request.open("PUT", "http://localhost:8080/fish/ID"+fid);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	request.send(
		reqString
	);
};

var deleteFish = function(request) {
	fid = document.getElementById("fid").value;
	if(!fid.match(numeric)) {
		alert("Please select a fish.");
	}
	else {
		if(confirm("Are you sure you want to delete this fish?")) {
			request.open("DELETE", "http://localhost:8080/fish/ID"+fid);
			request.send();
		}
	}
}

var getOneFish = function(request) {
	fid = document.getElementById("fid").value;
	if(!fid.match(numeric)) {
		alert("Please select a fish.");
	}
	else {
		request.open("GET", "http://localhost:8080/fish/ID"+fid);
		request.send();
	}
};

var getAllFish = function(request) {
	request.open("GET", "http://localhost:8080/fish");
	request.send();
};

// If no fish in database or if single fish does not exist
// jsondata return an empty list. if(jsondata.length == 0) to test.
var displayFish = function(request) {
	var jsondata = JSON.parse(request.responseText);
	
	var tank = document.getElementById("fishtank");
	 
	//clear all fish currently drawn to prep for re-draw
	tank.innerHTML = "";
	
	//if GET requests returns an empty list, say 'no fish'
	if(jsondata.length==0) {alert("No such fish.");}
	
	for ( var i = 0; i < jsondata.length; i++ ) { 
		// 'f' for 'fish' item in list of objects
		var f = jsondata[i];
		var newFish = drawFish(f);		
		tank.appendChild(newFish);
	}
	clearInput();
};

var fishClick = function(f) {
	document.getElementById("fid").value = f["id"];
	document.getElementById("fname").value = f["name"];
	document.getElementById("fwidth").value = f["width"];
	document.getElementById("fheight").value = f["height"];
	document.getElementById("fleft").value = f["left"];
	document.getElementById("ftop").value = f["top"];
	var fcolor = f["color"];
	if(fcolor=="black"){
		document.getElementById("fcolor").selectedIndex = 1;
	}
	else if(fcolor=="grey"){
		document.getElementById("fcolor").selectedIndex = 2;
	}
	else if(fcolor=="red"){
		document.getElementById("fcolor").selectedIndex = 3;
	}
	else if(fcolor=="blue"){
		document.getElementById("fcolor").selectedIndex = 4;
	}
	else if(fcolor=="green"){
		document.getElementById("fcolor").selectedIndex = 5;
	}
	else {
		document.getElementById("fcolor").selectedIndex = 0;
	}
	deselectFish();
	document.getElementById("ID"+f["id"]).style.backgroundColor = 'rgba(0,255,0,0.4)';
};

var drawFish = function(f) {
		console.log(f);
		var fish = document.createElement("div");
		// fish span ids will be in "fid#" format
		fish.id = "ID" + f["id"];
		fish.className = "fish";
		// url is 'images/fish-(color).png'
		fish.style.backgroundImage = "url('images/fish-" + f["color"] + ".png')";
		fish.style.width = f["width"]+"px";
		fish.style.height = f["height"]+"px";
		fish.style.lineHeight = f["height"]+"px";
		fish.style.left = f["left"]+"px";
		fish.style.top = f["top"]+"px";		
		fish.onclick = function() {
				fishClick(f);
		};
		return fish;
};

//temporarily use 'add' button as a getallfish button
btnUpdateTank.onclick = function() {	
	if(faction.value == "getone") {
		MakeHTTPRequest(getOneFish, function(getreq) 
			{
				console.log("Get request success!");
				displayFish(getreq);
			}
		);
		clearInput();
	}
	else if(faction.value == "getall") {
		MakeHTTPRequest(getAllFish, function(getreq) 
			{
				console.log("Get request success!");
				displayFish(getreq);
			}
		);
	}
	else if(faction.value == "post") {
		// isNaN(var) checks if var is "Not a Number"
		var fname = document.getElementById("fname").value;
		var fwidth = document.getElementById("fwidth").value;
		var fheight = document.getElementById("fheight").value;
		var fleft = document.getElementById("fleft").value;
		var ftop = document.getElementById("ftop").value;
		var fcolor = document.getElementById("fcolor").value;
		//Data validation client-side, doing (?,value) on server-side too but better safe than screwed
		//No blank entries
		if(fname==""||fwidth==""||fheight==""||fleft==""||ftop==""||fcolor==""){
			alert("One or more fields are blank!");
		}
		//INT entries must be numbers
		else if(!fwidth.match(numeric)||!fheight.match(numeric)||!fleft.match(numeric)||!ftop.match(numeric)){
			alert("Width, Height, X, and Y must be numbers!");
		}
		else if(parseInt(fleft)+parseInt(fwidth) > TANK_WIDTH || parseInt(ftop)+parseInt(fheight) > TANK_HEIGHT) {
			alert("Fish will not fit at specified location.");			
		}
		else if(!fname.match(alphanum)){
			alert("Name must be alphanumeric(a-Z, 0-9).");
		}
		else {
			//getall/display shoehorned into a POST callback
			MakeHTTPRequest(addFish, function() {
				console.log("Post request successful!");
				MakeHTTPRequest(getAllFish, function(getreq) 
					{
						console.log("Get request successful!");
						displayFish(getreq);
					}
					);	
				}
			);
			clearInput();
		}
	}
	else if(faction.value == "put") {
		MakeHTTPRequest(updateFish, function() {
			console.log("Put request successful!");
			MakeHTTPRequest(getAllFish, function(getreq) 
				{
					displayFish(getreq);
				}
			);	
		}
		);
	}
	else if(faction.value == "delete") {
		MakeHTTPRequest(deleteFish, function() {
			console.log("Delete request successful!");
			MakeHTTPRequest(getAllFish, function(getreq) 
				{
					displayFish(getreq);
				}
			);	
		});
		clearInput();
	}
	else {
		alert("Invalid action.");
	}

};

var clearInput = function() {
	document.getElementById("fid").value = "";
	document.getElementById("fname").value = "";
	document.getElementById("fwidth").value = "";
	document.getElementById("fheight").value = "";
	document.getElementById("fleft").value = "";
	document.getElementById("ftop").value = "";
	document.getElementById("fcolor").selectedIndex = 0;
	document.getElementById("faction").selectedIndex = 0;
	deselectFish();
};

var deselectFish = function() {
	var fish = document.getElementsByClassName("fish");
	var i;
	for(i=0; i<fish.length; i++) {
		fish[i].style.backgroundColor = "initial";
	}
}

//add some fancy dynamic interface stuff later
//for now just get some sh*t done
/*
selAction.onchange = function() {
	document.getElementById("fid").style.visibility = "hidden";
};
*/

MakeHTTPRequest(getAllFish, function(getreq) 
	{
		console.log("Get request successful!");
		displayFish(getreq);
	}
);

/*
var fish = document.getElementById("testfish");
fish.style.backgroundImage = "url('images/fish-blue.png')";
fish.style.width = "300px";
fish.style.height = "200px";
fish.style.lineHeight = "200px";
fish.innerHTML = "Brian";
*/
