$(document).ready(function() {
  var myDataRef = new Firebase('https://theremouse.firebaseio.com/');
	var theremins = {};
	var userId = Math.floor(Math.random() * 1000000) + 1;

	var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

	$(document).mousemove(function(event) {
    var x = event.pageX - 900;
    var y = event.pageY;
		$(".x").text("X: " + (x + 900));
		$(".y").text("Y: " + y);

		myDataRef.push({xCoord: x, yCoord: y, userId: userId});

    updateView(x, y);
	});

	myDataRef.on('child_added', function(snapshot) {
    var userId = snapshot.val().userId;
  	if (!theremins[userId]) {
  		var theremin = new Theremin(audioCtx);
  		theremins[userId.toString()] = theremin;
  	}
  	var x = snapshot.val().xCoord;
  	var y = snapshot.val().yCoord;
  	theremins[userId].update(x, y);
  });

  // clean the database every 5 seconds
  // it's only used for the real time polyphonic feature
  setInterval(function() {myDataRef.remove()}, 5000)
});

function updateView(axisX, axisY) {
  var width = $('body').width();
  var height = $('body').height();

  var hue = Math.floor(axisX / width * 360);
  var saturation = Math.floor(axisY / height * 100);
  var lightness = Math.floor(axisY / height * 100);

  $('body').css('background', 'hsl(' + hue + ',' + saturation + '%, ' + lightness + '%)');
}
