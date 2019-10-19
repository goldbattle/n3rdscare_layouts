'use strict';




var UPDATE_INTERVAL = 60000; // (ms)
var updateInterval;


module.exports = function(nodecg) {

	// Define that we should update our countdown every minute
	updateInterval = setInterval(updateCountdown, UPDATE_INTERVAL);

	// This will decrease our countdown by one minute
	function updateCountdown(value, cb) {


		// Get the replicant
		var countdownRep = nodecg.Replicant('countdownRep');

		// Decrease its value by one
		if(countdownRep.value != null && countdownRep.value > 0) {
			countdownRep.value = countdownRep.value - 1
		}

		// If less than zero then reset it
		if(countdownRep.value < 0) {
			countdownRep.value = 0;
		}

	}

};
