

// Our replicants
var countdownRep = nodecg.Replicant('countdownRep');

// Display of the total raised so far
var lblMinLeft = document.getElementById('lblMinLeft');
countdownRep.on('change', function(newVal, oldVal) {
	if(newVal==null) lblMinLeft.value = 0;
	else lblMinLeft.value = newVal;
});



// On click of our button, lets trigger the "update total" event
// This will get the total donation amount and the next donation goal
var update = document.getElementById('update');
var toast = document.getElementById('toast');
update.addEventListener('click', function() {
	update.setAttribute('disabled', 'true');
	var countdownRep = nodecg.Replicant('countdownRep');
	var lblMinLeft = document.getElementById('lblMinLeft');
	update.removeAttribute('disabled');
	if (lblMinLeft.value < 0) {
		toast.text = 'Error, only positive values!!';
		toast.show();
	} else {
		countdownRep.value = lblMinLeft.value
		toast.text = 'Successfully updated donations.';
		toast.show();
	}
});


