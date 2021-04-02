let players = [];
let locations = [];
let events = [];
let gameNames = [];
let games = [];

var playerStrings = [];
function getPlayers() {
	$.ajax({
		url: "php/getplayers.php",
		type: "get",
		data: { },
		success: function(response) {
			players = response.data;
			var playerSelect = $('.playerSelect');
			var winnerSelect = $('#winnerSelect');
			var loserSelect = $('#loserSelect');
			$.each(players, function(key, value) { 
				playerSelect.append('<option value="'+value.id+'">'+value.alias+'</option>');
				playerStrings.push(value.alias);
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
		complete : function(){
			$( "#playerOneFilter" ).autocomplete({source: playerStrings});
			$( "#playerTwoFilter" ).autocomplete({source: playerStrings});
			$( "#player-filter-player-one" ).autocomplete({source: playerStrings});
			$( "#player-filter-player-two" ).autocomplete({source: playerStrings});
		}
	});	
}

var locationStrings = [];
function getLocations() {
	$.ajax({
		url: "php/getlocations.php",
		type: "get", 
		data: { },
		success: function(response) {
			locations = response.data;
			var locationSelect = $('.locationSelect');
			$.each(locations, function(key, value) { 
	        		locationSelect.append('<option value="'+value.id+'">'+value.name+'</option>');
				locationStrings.push(value.name);
	    		});
	    		$(".selectpicker").selectpicker('refresh');
		},		
		error: function(xhr) {},
		complete : function(){
			$('#locationSelect').val(newObject).change();
			newObject = '';
			$( "#locationFilter" ).autocomplete({source: locationStrings});
			$( "#player-filter-location" ).autocomplete({source: locationStrings});
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

var gameNameStrings = [];
function getGameNames() {
	$.ajax({
		url: "php/getgamenames.php",
		type: "get", 
		data: { },
		success: function(response) {
			gameNames = response.data;
			var gameNameSelect = $('.gameNameSelect');
			$.each(gameNames, function(key, value) { 
	        		gameNameSelect.append('<option value="'+value.id+'">'+value.name+'</option>');
	        		gameNameStrings.push(value.name);
	    		});
	    		$(".selectpicker").selectpicker('refresh');
		},		
		error: function(xhr) {},
		complete : function(){
			$('#gameNameSelect').val(newObject).change();
			newObject = '';
			$( "#gameNameFilter" ).autocomplete({source: gameNameStrings});
			$( "#player-filter-game-name" ).autocomplete({source: gameNameStrings});
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

/*
function getGroups() {
	$.ajax({
		url: "php/get-groups.php",
		type: "get", 
		data: { },
		success: function(response) {
			groups = response.data;
			$.each(groups, function(key, value) { 
				groupStrings.push(value.name);
	    		});
		},		
		error: function(xhr) {},
		complete : function(){
			newObject = '';
			$( "#groupFilter" ).autocomplete({source: groupStrings});
			$( "#player-filter-group" ).autocomplete({source: groupStrings});
		}
	});
}
*/

var groupMembers;
var groups = [];
var groupStrings = [];
function getGroupMembers() {
	$.ajax({
		url: "php/get-group-members.php",
		type: "get", 
		data: { },
		success: function(response) {
			groupMembers = response.data;
			var groupSelect = $('.groupSelect');
			$.each(groupMembers, function(key, value) { 
				var groupNameCheck = pluckByName(groups, value.name, true);
				if(!groupNameCheck){
					let groupItem = {};
					groupItem.id = value.id;
					groupItem.name = value.name;
					groupItem.location = value.location;
					groupItem.gameName = value.gameName;
					groupItem.memberIDs = [];
					groupItem.memberIDs.push(value.memberID);
					groupItem.members = [];
					groupItem.members.push(value.member);
					groups.push(groupItem);
					groupStrings.push(value.name);
					groupSelect.append('<option value="'+value.id+'">'+value.name+'</option>');
				} else {
					groups.find(x => x.name === value.name).memberIDs.push(value.memberID);
					groups.find(x => x.name === value.name).members.push(value.member);
				}
	    		});
		},		
		error: function(xhr) {},
		complete : function(){
			newObject = '';
			$(".selectpicker").selectpicker('refresh');
			//$( "#groupFilter" ).autocomplete({source: groupStrings});
			//$( "#player-filter-group" ).autocomplete({source: groupStrings});
		}
	});
}

//Check if object name exists in array
function pluckByName(inArr, name, exists)
{
    for (i = 0; i < inArr.length; i++ )
    {
        if (inArr[i].name == name)
        {
            return (exists === true) ? true : inArr[i];
        }
    }
}