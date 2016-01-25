Global = {}
$( document ).ready(function(){

  console.log("test")
  var o = {i1: 1,i2: 2,i3: 3,i4: 4}

	setPredictButton()
});

Global.cands = [
'Bush, Jeb',
'Carson, Benjamin S.',
'Christie, Christopher J.',
'Clinton, Hillary Rodham',
"Cruz, Rafael Edward",
'Fiorina, Carly',
'Graham, Lindsey O.',
'Huckabee, Mike',
'Jindal, Bobby',
'Kasich, John R.',
'Lessig, Lawrence',
"O'Malley, Martin Joseph",
'Pataki, George E.',
'Paul, Rand',
'Perry, James R.',
'Rubio, Marco',
'Sanders, Bernard',
'Santorum, Richard J.',
'Trump, Donald J.',
'Walker, Scott',
'Webb, James Henry Jr.'
]


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
	  $.getJSON( "http://znagler.pythonanywhere.com",o,displayResults)
	});
}

function comparator(a,b){
  return b[1] - a[1]
}
function displayResults(data){
  results  = data.results[0]
  var candsWithProbs = Object.keys(results).map(function(key){return [Global.cands[+key.slice(1)],results[key]]})
  // console.log(candsWithProbs)
  console.log(candsWithProbs.sort(comparator))

}
