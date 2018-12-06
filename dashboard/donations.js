

// Our replicants
var totalRep = nodecg.Replicant('totalRep');
var goalRep = nodecg.Replicant('goalRep');

// Display of the total raised so far
var totalLbl = document.getElementById('lblTotal');
totalRep.on('change', function(newVal, oldVal) {
	totalLbl.innerHTML = newVal.formatted;
});

// Display of the current goal
var goalLbl = document.getElementById('lblGoal');
var goaltextLbl = document.getElementById('lblGoalText');
goalRep.on('change', function(newVal, oldVal) {
	goalLbl.innerHTML = newVal.formatted;
	goaltextLbl.innerHTML = newVal.description;
});

// On click of our button, lets trigger the "update total" event
// This will get the total donation amount and the next donation goal
var update = document.getElementById('update');
var toast = document.getElementById('toast');
update.addEventListener('click', function() {
	update.setAttribute('disabled', 'true');
	nodecg.sendMessage('updateTotal', "update", function (result) {
		update.removeAttribute('disabled');
		if (!result) {
			toast.text = 'Error updating total. Check console.';
			toast.show();
			return;
		}
		else {
			toast.text = 'Successfully updated donations.';
			toast.show();
		}
	});
});


