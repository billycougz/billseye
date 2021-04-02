let players = [];
let locations = [];
let events = [];
let gameNames = [];
let games = [];

function getPlayers() {
	$.ajax({
		url: "php/getplayers.php",
		type: "get",
		data: { },
		success: function(response) {
			players = response.data;
			var winnerSelect = $('#winnerSelect');
			var loserSelect = $('#loserSelect');
			$.each(players, function(key, value) { 
				winnerSelect.append('<option value="'+value.id+'">'+value.alias+'</option>');
				loserSelect.append('<option value="'+value.id+'">'+value.alias+'</option>');
			});
			$(".selectpicker").selectpicker('refresh');
			if( $("#winnerSelect").val() != "" ){
				$('#loserSelect').val(newObject).change();
			}
			if( $("#winnerSelect").val() == "" ){
				$('#winnerSelect').val(newObject).change();
			}
			newObject = '';
		},		
		error: function(xhr) {},
		complete : function(){}
	});	
}

function getLocations() {
	$.ajax({
		url: "php/getlocations.php",
		type: "get", 
		data: { },
		success: function(response) {
			locations = response.data;
			var locationSelect = $('#locationSelect');
			$.each(locations, function(key, value) { 
	        		locationSelect.append('<option value="'+value.id+'">'+value.name+'</option>');
	    		});
	    		$(".selectpicker").selectpicker('refresh');
		},		
		error: function(xhr) {},
		complete : function(){
			$('#locationSelect').val(newObject).change();
			newObject = '';
		}
	});
}

function getEvents() {
	$.ajax({
		url: "php/getevents.php",
		type: "get", 
		data: { },
		success: function(response) {
			events = response.data;
			var eventSelect = $('#eventSelect');
			$.each(events, function(key, value) { 
	        		eventSelect.append('<option value="'+value.id+'">'+value.name+'</option>');
	    		});
	    		$(".selectpicker").selectpicker('refresh');
		},		
		error: function(xhr) {},
		complete : function(){
			$('#eventSelect').val(newObject).change();
			newObject = '';
		}
	});
}

function getGameNames() {
	$.ajax({
		url: "php/getgamenames.php",
		type: "get", 
		data: { },
		success: function(response) {
			gameNames = response.data;
			var gameNameSelect = $('#gameNameSelect');
			$.each(gameNames, function(key, value) { 
	        		gameNameSelect.append('<option value="'+value.id+'">'+value.name+'</option>');
	    		});
	    		$(".selectpicker").selectpicker('refresh');
		},		
		error: function(xhr) {},
		complete : function(){
			$('#gameNameSelect').val(newObject).change();
			newObject = '';
		}
	});
}

function getGames() { 
	$.ajax({
		url: "php/getgames.php",
		type: "get", 
		data: { },
		success: function(response) {
			games = response.data;
		},		
		error: function(xhr) {}
	});	
}