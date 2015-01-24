$(document).ready(function() {
	var myDataRef = new Firebase('https://theremouse.firebaseio.com/');
	var query = myDataRef.orderByChild("timestamp").limitToLast(100);
	var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

	theremin = new Theremin(audioCtx);

	$(document).mousemove(function(event) {
		$(".x").text("X: " + event.pageX); 
		$(".y").text("Y: " + event.pageY);

		// console.log(Math.ceil(event.pageX/100))
		// theremin.update(Math.ceil(event.pageX/100)*100, Math.ceil(event.pageY/100)*100);
		// theremin2.update(event.pageX*.2,event.pageY);
		theremin.update(event.pageX, event.pageY);
		var counter = 0
		myDataRef.push({pitch: theremin.pitch, volume: theremin.volume});
		query.on('child_added', function(snapshot) {
			counter++
			console.log(snapshot.val())
		});
	});

});

