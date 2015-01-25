$(document).ready(function() {
  	var myDataRef = new Firebase('https://theremouse.firebaseio.com/');
  	// myDataRef.remove()
	var theremins = {};
	var userId = Math.floor(Math.random() * 1000000) + 1;

	var audioCtx = new(window.AudioContext || window.webkitAudioContext)();


	$(document).mousemove(function(event) {
		$(".x").text("X: " + event.pageX);
		$(".y").text("Y: " + event.pageY);

		myDataRef.push({xCoord: event.pageX, yCoord: event.pageY, userId: userId});

	});


	myDataRef.on('child_added', function(snapshot) {
	if (!theremins[userId]) {
		var theremin = new Theremin(audioCtx);
		theremins[userId.toString()] = theremin;
	} 
	var x = snapshot.val().xCoord;
	var y = snapshot.val().yCoord;
	theremins[userId].update(x, y);

});

});

