$("#formID").submit(function(event){event.preventDefault()});
$("#addFormID").submit(function(event){event.preventDefault()});

//Submit game data
$(document).on('submit', '#formID', function(){
	var form_data = JSON.stringify($(this).serializeObject());
	// submit form data to api
	$.ajax({
	    url: "php/create.php",
	    type : "POST",
	    contentType : 'application/json',
	    data : form_data,
	    success : function(result) {
	    	addNewGame();
	    },
	    error: function(xhr, resp, text) {
	        // show error to console
	        console.log(xhr, resp, text);
	    }
	});
	 
	return false;    
    
});

//Add new player, event, location, or game name
let newObject = '';
$(document).on('submit', '#addFormID', function(){
	var form_data = JSON.stringify($(this).serializeObject());
	var json = JSON.parse(form_data);
	var objectType = '';
	if(json.defaultGroupGroupInput) {
		localStorage.setItem("group_id", json.defaultGroupGroupInput);
		var groupName = groups.find(x => x.id == json.defaultGroupGroupInput).name;
		localStorage.setItem("group_name", groupName);
		$('#objectAddedMsg').html('Success!');
		$('#objectAdded').css("display", "table");
		$('#objectAdded').css("width", "100%");
		setTimeout( function(){ 
			clearModalInputs();
			$("#addModal").modal('hide');
			$('#group-greeting-container').css('display', 'block');
			$('#group-greeting-text').html('Your default group is now set to <strong>' + localStorage.getItem("group_name") + '</strong>.');

		}  , 1000 );
		return
	}
	if(json.fname){objectType = 'Player';}
	if(json.eventName){objectType = 'Event';}
	if(json.locationName){objectType = 'Location';}
	if(json.gameName){objectType = 'Game';}
	if(json.address){objectType = 'Email';}
	$('#objectAddedMsg').html('Success!');
	$('#objectAdded').css("display", "table");
	$('#objectAdded').css("width", "100%");
	// submit form data to api
	$.ajax({
	    url: "php/addobject.php",
	    type : "POST",
	    contentType : 'application/json',
	    data : form_data,
	    success : function(result) {
	    	clearModalInputs();
	        var addedObject;
		if(json.fname){
			addedObject = getMax(players, "id");
			newObject = Number(addedObject.id) + 1;	
			if( $("#winnerSelect").val() == "" ){
				$('#winnerSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Player</option>');
			}
			if( $("#winnerSelect").val() != "" ){
				$('#loserSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Player</option>');
			}
			getPlayers();	
		}
		if(json.eventName){
			addedObject = getMax(events, "id");
			newObject = Number(addedObject.id) + 1;	
			$('#eventSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Event</option>');
			getEvents();
		}
		if(json.locationName){
			addedObject = getMax(locations, "id");
			newObject = Number(addedObject.id) + 1;	
			$('#locationSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Location</option>');
			getLocations(newObject);
		}
		if(json.gameName){
			addedObject = getMax(gameNames, "id");
			newObject = Number(addedObject.id) + 1;	
			$('#gameNameSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Game</option>');
			getGameNames();
		}
	        $("#addModal").modal('hide');
	    },
	    error: function(xhr, resp, text) {
	        // show error to console
	        console.log(xhr, resp, text);
	    }
	});
	return false;    
});

function addNewGame() {
	$('#formID').css("display", "none");
	$('#gameAdded').css("display", "block");
	$('#gameAddedSpace').css("display", "block");
	updateData();

	setTimeout(function () {
		$('#formID').css("display", "block");
		$('#gameAdded').css("display", "none");
		$('#gameAddedSpace').css("display", "none");
		$('#testAlert').css("display", "none");
		resetData();
		if(screen.width >= 1200){
			showGames();
		}
	}, 2000);
}