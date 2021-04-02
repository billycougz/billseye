var gameTable;
var gameFilter = `

`;

function createGameTable(data) {
	gameTable = $('<table id="gameTableID" class="table table-hover"><tr><th>#</th><th id="dateHeader" onclick="sortGames(this)">Date <span id="dateArrow" class="glyphicon glyphicon-triangle-bottom"></span></th><th id="winnerHeader" onclick="sortGames(this)">Winner </th><th id="loserHeader" onclick="sortGames(this)">Loser </th></tr><tbody id=""></tbody></table>');
	for (var i = 0; i < data.length; i++) {
		
		if(selectedPlayerAlias) {
			var rowColor;
			var rowText;
			if(data[i].winner == selectedPlayerAlias) {
				rowColor = '#DFF0D8';
				rowText = '#598C59';
			} else {
				rowColor = '#F2DEDE';
				rowText = '#BB6A69';
			}
		}
	
		var gameTableRow = $('<tr style="background-color:' + rowColor + ';color:' + rowText + '" class="gameRow" data-game-id="' + data[i].id + '" data-game-date="' + data[i].date + '"data-game-location="' + data[i].location + '" data-game-name="' + data[i].gameName + '"data-game-winner="' + data[i].winner + '"data-game-loser="' + data[i].loser + '"data-game-duration="' + data[i].duration + '"></tr>');
		$(gameTableRow).append("<td>"+ (i+1) +"</td>");
		var date = new Date(data[i].date);
		date.setDate(date.getDate() + 1);
		$(gameTableRow).append("<td>"+ formatDate(date)+"</td>");
		$(gameTableRow).append("<td>"+data[i].winner+"</td>");
		$(gameTableRow).append("<td>"+data[i].loser+"</td>");
		$(gameTableRow).bind("click", createGameModal);
		$(gameTable).append(gameTableRow);
	}
}

var createGameModal = function() {
	var gameId = $(this).attr("data-game-id");
	var gameDate = $(this).attr("data-game-date");
	var gameDuration = $(this).attr("data-game-duration");
	if(gameDuration == 'null' || gameDuration == '00:00:00'){gameDuration = 'N/A'};
	var gameLocation = $(this).attr("data-game-location");
	var gameName = $(this).attr("data-game-name");
	var winner = $(this).attr("data-game-winner");
	var loser = $(this).attr("data-game-loser");
	
	$('#gameModalDate').html('<strong>Date: </strong>' + gameDate);
	$('#gameModalDuration').html('<strong>Duration: </strong>' + gameDuration);
	$('#gameModalLocation').html('<strong>Location: </strong>' + gameLocation);
	$('#gameModalName').html('<strong>Game: </strong>' + gameName);
	$('#gameModalMatchup').html('<strong>Matchup: </strong>' + winner + ' vs ' + loser);
	$('#gameModalWinner').html('<strong>Winner: </strong>' + winner);
	$('#detailModalTitle').html('Game Details');
	$('#playerGameTableHeader').html("");
	$('#playerGameTable').html("");
	
	$("#main-filter-inputs").css("display", "block");
	$("#groupMembersTable").css("display", "none");
}

function showGames() {
	createGameTable(games);
	$("#gameTable").html(gameTable);
	$("#data-table-container").css("visibility", "visible");
	//filterGames();
	$("#tile-header").html("Game History");
	$("#gameFilter").css("display", "block");
	$("#playerFilter").css("display", "none");
	$("#filter-title").html("Filter Game History");
	activeFilter = 'game';  
	$("#main-filter").css("display", "block");
	$("#groups-options-container").css("display", "none");
	$('#game-filter-button').html('Filter (0)');
	if(localStorage.getItem("group_id")){
		$("#groupFilter").val( localStorage.getItem("group_id") );
		$(".selectpicker").selectpicker('refresh');
		$( "#saveFiltersButton" ).trigger( "click" );
	}
}

var gamesFiltered;
/*var filterGames = function(){
	$(".game-filter-input").on("keyup change", function() {
		gamesFiltered = [];
		var playerOneSearchValue = $("#playerOneFilter").val();
		var playerTwoSearchValue = $("#playerTwoFilter").val();
		var locationSearchValue = $("#locationFilter").val();
		var dateSearchValue = $("#dateFilter").val();
		var gameNameSearchValue = $("#gameNameFilter").val();
		
		$(games).each(function(index, game){
			if( game.winner.toLowerCase().indexOf(playerOneSearchValue.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(playerOneSearchValue.toLowerCase()) >= 0 || playerOneSearchValue == "") {
				if( game.winner.toLowerCase().indexOf(playerTwoSearchValue.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(playerTwoSearchValue.toLowerCase()) >= 0 || playerTwoSearchValue == "") {
					if( game.location.toLowerCase().indexOf(locationSearchValue.toLowerCase()) >= 0 || locationSearchValue == "") {
						if( game.gameName.toLowerCase().indexOf(gameNameSearchValue.toLowerCase()) >= 0 || gameNameSearchValue == "") {
							if( formatDate(game.date).indexOf(formatDate(dateSearchValue)) >= 0 || dateSearchValue == "") {
								gamesFiltered.push(game);
							}
						}
					}
				}
			}
		});
		createGameTable(gamesFiltered);
		$("#gameTable").html(gameTable);	
		$("#table").html(gameTable);
		$(".gameTableClass").html(gameTable);	
	});
}*/

var counter;
$("#saveFiltersButton").on("click", function() {

	var filter;
	if(activeFilter == 'game') {
		filter = {
			groupID: $("#groupFilter").val(),
			winnerID: $("#playerOneFilter").val(),
			loserID: $("#playerTwoFilter").val(),
			locationID: $("#locationFilter").val(), 
			gameNameID: $("#gameNameFilter").val()
		};
	}
	if(activeFilter == 'player') {
		filter = {
			groupID: $("#player-filter-group").val(),
			locationID: $("#player-filter-location").val(),
			gameNameID: $("#player-filter-game-name").val()
		};
	}

		
		counter = 0;
		$.each( filter, function( key, value ) {
			if(value != ""){
				counter++;
			}
		});
		
		$('#game-filter-button').html('Filter (' + counter + ')');
		
		gamesFiltered = games.filter(function(item) {
			for (var key in filter) {
				
				var groupCheck = false;
				if(key == 'groupID' && filter[key] != undefined && filter[key] != '') {
					
					var filterGroupID = filter[key];
					var currentGameWinnerID = item['winnerID'];
					var currentGameLoserID = item['loserID'];
					var filterGroupMembers;
					if(groups.find(group => group.id == filterGroupID)){
						filterGroupMembers = groups.find(group => group.id == filterGroupID).memberIDs;
					}
					
					if($.inArray(currentGameWinnerID, filterGroupMembers) == -1 || $.inArray(currentGameLoserID, filterGroupMembers) == -1) {
						return false;
					}	
					groupCheck = true;
				}
			
				var playerCheck = false;
				if (item[key] != filter[key] && filter[key] != undefined && filter[key] != '') {
					//Check winner and loser for player name
					if(key == 'winnerID'){
						if (item['loserID'] != filter['winnerID']) {
							return false;
						}
						playerCheck = true;
					}
					if(key == 'loserID'){
						if (item['winnerID'] != filter['loserID']) {
							return false;
						}
						playerCheck = true;
					}
					if(!playerCheck && !groupCheck) {
						return false;
					}
				}
			}
			return true;
		});
		
	if(activeFilter == 'game') {
		
		createGameTable(gamesFiltered);
		//$("#gameTable").html(gameTable);	
		$("#table").html(gameTable);
		$(".gameTableClass").html(gameTable);
	}
	
	if(activeFilter == 'player') {
	
		playerObjects = gamesFiltered.reduce((acc, game) => {
			if (acc[game.winner]) {
				acc[game.winner].wins = acc[game.winner].wins + 1 || 1;
			} else acc[game.winner] = { wins: 1, losses: 0};
			
			if(acc[game.loser]){
				acc[game.loser].losses = acc[game.loser]['losses'] + 1 || 1;
			} else acc[game.loser] = { wins: 0, losses: 1};
			
			return acc;
		}, {});
		
		playersFiltered = Object.keys(playerObjects).reduce((arr, key) => {
		  const player = {
		   alias: key,
		   wins: playerObjects[key].wins,
		   losses: playerObjects[key].losses,
		   pct: (playerObjects[key].wins / (playerObjects[key].wins + playerObjects[key].losses)).toFixed(2),
		   id: players.find(x => x.alias == key).id,
		   fname: players.find(x => x.alias == key).fname,
		   lname: players.find(x => x.alias == key).lname
		  };
		  arr.push(player);
		  return arr;
		}, []);
				
		playersFiltered = sortJSON(playersFiltered, 'pct', '321');
		createPlayersTable(playersFiltered);
		$("#table").html(playerTable);	
		$("#gameTable").html(playerTable);
	}	
	
});
/*
var filterPlayerGames = function(){
	gamesFiltered = [];
	
	$(games).each(function(index, game){
		if( game.winner.toLowerCase().indexOf(selectedPlayerAlias.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(selectedPlayerAlias.toLowerCase()) >= 0) {
			gamesFiltered.push(game);
		}
	});
	createGameTable(gamesFiltered);
}*/

//Clear filters
$(document).on('click', '#clearFiltersButton', function(){   
	if(activeFilter == 'game') {
		$('#groupFilter').val('').change();
		$('#playerOneFilter').val('').change();
		$('#playerTwoFilter').val('').change();
		$('#locationFilter').val('').change();
		$('#gameNameFilter').val('').change();
		$('#dateFilter').val('').change();
		$('#minGamesFilter').val('').change();
		$("#playerOneFilter").trigger(jQuery.Event("keyup"));
	}
	
	if(activeFilter == 'player') {
		$('#player-filter-group').val('').change();
		$('#player-filter-player-one').val('').change();
		$('#player-filter-player-two').val('').change();
		$('#player-filter-location').val('').change();
		$('#player-filter-game-name').val('').change();
		$('#player-filter-date').val('').change();
		$('#player-filter-min-games').val('').change();
		$("#player-filter-player-one").trigger(jQuery.Event("keyup"));
	}
});

function sortByAsc(array, key) {
    return array.sort(function(a, b) {
    	if(isNaN(a[key])) {
    		var x = a[key]; var y = b[key];
    	} else {
		var x = parseFloat(a[key]); var y = parseFloat(b[key]);
    	}
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function sortByDec(array, key) {
    return array.sort(function(b, a) {
    	if(isNaN(a[key])) {
    		var x = a[key]; var y = b[key];
    	} else {
		var x = parseFloat(a[key]); var y = parseFloat(b[key]);
    	}
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var lastSort = 'date';
var sortGames = function(sortBy) {
	
	var sortId = $(sortBy).attr('id');
	var sortByType;
	
	if(sortId == "winnerHeader") {
		sortByType = "winner";
	}
	if(sortId == "loserHeader") {
		sortByType = "loser";
	}
	if(sortId == "dateHeader") {
		sortByType = "date";
	}
	
	sortId = "#" + $(sortBy).attr('id');
	
	if(sortByType == lastSort) {
		games = sortByDec(games, sortByType);
		showGames();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-bottom"></span>');
		lastSort = '';
	} else {
		games = sortByAsc(games, sortByType);
		showGames();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-top"></span>');
		lastSort = sortByType;
	}
}

$(document).on('click', '#game-filter-button', function(){ 
	$("#filter-modal").modal('show');
});