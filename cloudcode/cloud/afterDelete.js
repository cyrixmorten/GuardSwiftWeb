
Parse.Cloud.afterDelete("Circuit", function(request) {
  query = new Parse.Query("CircuitStarted");
  query.equalTo("circuit", request.object);
  query.doesNotExist('timeEnded');
  query.find().then(function(circuitsStarted) {
  		var now = new Date();
  		circuitsStarted.forEach(function(circuitStarted) {
  			circuitStarted.set('timeEnded', now);
  			circuitStarted.save();
  		});
  }, function(error) {
  		console.error("Error finding CircuitStarted " + error.code + ": " + error.message);
  });
});

Parse.Cloud.afterDelete("DistrictWatch", function(request) {
  query = new Parse.Query("DistrictWatchStarted");
  query.equalTo("districtWatch", request.object);
  query.doesNotExist('timeEnded');
  query.find().then(function(districtWatchesStarted) {
  		var now = new Date();
  		districtWatchesStarted.forEach(function(districtWatch) {
  			districtWatch.set('timeEnded', now);
  			districtWatch.save();
  		});
  }, function(error) {
  		console.error("Error finding CircuitStarted " + error.code + ": " + error.message);
  });
});