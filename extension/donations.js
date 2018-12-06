'use strict';

var fs = require('fs');
var path = require('path');
var numeral = require('numeral');
var rp = require('request-promise');
var Q = require('q');
const util = require('util');



var API_URL_TOTAL = 'https://donate.n3rds.care/api/v1/events/mindcrack-marathon-winter-2018/'; //Add participantID here
var API_URL_THRESHOLD = 'https://donate.n3rds.care/api/v1/events/mindcrack-marathon-winter-2018/incentives/thresholds/'; //Add participantID here
var POLL_INTERVAL = 30000; // (ms)
var updateInterval;



module.exports = function(nodecg) {

	// Create the replicants
	var totalRep = nodecg.Replicant('totalRep', {defaultValue:
			{
				raw: 0,
				formatted: '$0.00'
			}
	});
	var goalRep = nodecg.Replicant('goalRep', {defaultValue:
			{
				raw: 0,
				formatted: '$0.00',
				description: 'Unknown'
			}
	});

	// Call the API once to get starting value
	// Also tell nodecg to call back if "updateTotal" is triggered
	updateTotal("start", null);
	nodecg.listenFor('updateTotal', updateTotal);

	// Function that will call our API to get the donation information
	// TODO: If we can't get it, error out to the user so they can see it failed...
	function updateTotal(value, cb) {
		// set our polling interval
		var deferred = Q.defer();
		clearInterval(updateInterval);
		updateInterval = setInterval(updateTotal, POLL_INTERVAL);

		// DONATIONS: setup where we are going to call
		var options_donations = {
			uri: API_URL_TOTAL,
			json: true
		};
		// DONATIONS: our callback function
		rp(options_donations)
			.then(function (response) {
				var el_data = response;
				nodecg.log.debug('Total is ', el_data.amount);
				totalRep.value = {
					raw: el_data.amount,
					formatted: numeral(el_data.amount).format('$0,0.00')
				};
				deferred.resolve(true);
			})
			.catch(function (err) {
				// Delete failed...
				deferred.reject(err);
			});
		// THRESHOLDS: setup where we are going to call
		var options_thresholds = {
			uri: API_URL_THRESHOLD,
			json: true
		};
		// THRESHOLDS: our callback function
		rp(options_thresholds)
			.then(function (response) {
				var el_data = response
				// loop through and find the closest goal
				var min_closest1 = 0.0;
				var min_closesttext1 = 0.0;
				var min_closest2 = 0.0;
				var min_closesttext2 = 0.0;
				// loop until we have one number greater then our current amount, and one less than
				for(var i = 0; i < el_data.length; i++) {
					if(el_data[i].amount > min_closest1) {
						min_closest1 = min_closest2;
						min_closesttext1 = min_closesttext2;
						min_closest2 = el_data[i].amount;
						min_closesttext2 = el_data[i].description;
					}
					if(min_closest2 > totalRep.value.raw && min_closest1 < totalRep.value.raw) {
						break;
					}
				}
				nodecg.log.debug('Goal is ', min_closest2);
				goalRep.value = {
					raw: min_closest2,
					formatted: numeral(min_closest2).format('$0,0.00'),
					description: min_closesttext2
				};
				deferred.resolve(true);
			})
			.catch(function (err) {
				// Delete failed...
				deferred.reject(err);
			});

		// Finally, call the callback if needed...
		if (cb != null){
			return cb(deferred.promise);
		}
		else{
			return deferred.promise;
		}
	}




};
