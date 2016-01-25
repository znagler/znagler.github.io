$( document ).ready(function(){

  console.log("test")
  var o = {i1: 1,i2: 2,i3: 3,i4: 4}
	
	setPredictButton()	
});


function setPredictButton(){
	console.log("set")
	$( ".predict" ).click(function( event ) {
	  event.preventDefault();
	  var i1 = $('#i1').val()
	  var i2 = $('#i2').val()
	  var i3 = $('#i3').val()
	  var i4 = $('#i4').val()
	  var o = {i1: i1,i2: i2,i3: i3,i4: i4}
	  console.log(o)
	  $.getJSON( "http://znagler.pythonanywhere.com",o,function(o){console.log("done"); console.log(o)})
	});
}