var activeFilter;
var playerTable;
var playerFilter = `
	
`;

function createPlayersTable(data) {
	playerTable = $('<table class="table table-hover"><tr><th>#</th><th id="playerHeader" onclick="sortPlayers(this)">Player </th><th id="winsHeader" onclick="sortPlayers(this)">W </th><th id="lossesHeader" onclick="sortPlayers(this)">L </th><th id="pctHeader" onclick="sortPlayers(this)">Pct <span id="dateArrow" class="glyphicon glyphicon-triangle-bottom"></span></th></tr><tbody id=""></tbody></table>');
	for (var i = 0; i < data.length; i++) {
		var playerTableRow = $('<tr class="playerRow" data-player-id="' + data[i].id + '" data-player-fname="' + data[i].fname + '"data-player-lname="' + data[i].lname + '" data-player-alias="' + data[i].alias + '"data-player-wins="' + data[i].wins + '"data-player-losses="' + data[i].losses + '"></tr>');
		$(playerTableRow).append("<td>"+ (i+1) +"</td>");
		$(playerTableRow).append("<td>"+data[i].alias+"</td>");
		$(playerTableRow).append("<td>"+data[i].wins+"</td>");
		$(playerTableRow).append("<td>"+data[i].losses+"</td>");
		if(data[i].pct == null){data[i].pct = '0.00';}
		$(playerTableRow).append("<td>"+data[i].pct+"</td>");
		$(playerTableRow).bind("click", createPlayerModal);
		$(playerTable).append(playerTableRow);
	}
}

var selectedPlayerAlias;
var createPlayerModal = function() {
	var gameId = $(this).attr("data-player-id");
	var fname = $(this).attr("data-player-fname");
	var lname = $(this).attr("data-player-lname");
	selectedPlayerAlias = $(this).attr("data-player-alias");
	var wins = $(this).attr("data-player-wins");
	var losses = $(this).attr("data-player-losses");
	var playerGames = [];
	if(gamesFiltered == null) {
		gamesFiltered = games;
	}
	$(gamesFiltered).each(function(index, game){
		if( game.winner.toLowerCase().indexOf(selectedPlayerAlias.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(selectedPlayerAlias.toLowerCase()) >= 0) {
			playerGames.push(game);
		}
	});
	//filterPlayerGames();
	$('#gameModalMatchup').html('');
	$('#gameModalDate').html('<strong>Name: </strong>' + fname + " " + lname);
	$('#gameModalLocation').html('<strong>Alias: </strong>' + selectedPlayerAlias);
	$('#gameModalName').html('<strong>Wins: </strong>' + wins);
	$('#gameModalWinner').html('<strong>Losses: </strong>' + losses);
	$('#detailModalTitle').html('Player Details');
	$('#playerGameTableHeader').html("<strong>" + selectedPlayerAlias + "'s " + "Game History</strong>");
	createGameTable(playerGames);
	$('#playerGameTable').html(gameTable);
	selectedPlayerAlias = null;

	$("#main-filter-inputs").css("display", "block");
	$("#groupMembersTable").css("display", "none");
}


function showPlayers() {
	createPlayersTable(players);
	$("#gameFilterPlaceholderDesktop").html(playerFilter);
	$("#gameTable").html(playerTable);
	filterPlayers();
	$("#data-table-container").css("visibility", "visible");
	$("#tile-header").html("Leadboard");
	$("#gameFilter").css("display", "none");
	$("#playerFilter").css("display", "block");
	$("#filter-title").html("Filter Leadboard");
	activeFilter = 'player';
	
	$("#main-filter").css("display", "block");
	$("#groups-options-container").css("display", "none");
	$('#game-filter-button').html('Filter (0)');
	if(localStorage.getItem("group_id")){
		$("#player-filter-group").val( localStorage.getItem("group_id") );
		$(".selectpicker").selectpicker('refresh');
		$( "#saveFiltersButton" ).trigger( "click" );
	}
}

var playerGamesFiltered;
var playerObjects;
var playersFiltered;
var filterPlayers = function(){
	/*$(".player-filter-input").on("keyup mouseup", function() {
		playerGamesFiltered = [];
		var playerOneSearchValue = $("#player-filter-player-one").val();
		var playerTwoSearchValue = $("#player-filter-player-two").val();
		var locationSearchValue = $("#player-filter-location").val();
		var dateSearchValue = $("#player-filter-date").val();
		var gameNameSearchValue = $("#player-filter-game-name").val();
		var minGamesValue = $("#player-filter-min-games").val();

		$(games).each(function(index, game){
			if( game.winner.toLowerCase().indexOf(playerOneSearchValue.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(playerOneSearchValue.toLowerCase()) >= 0 || playerOneSearchValue == "") {
				if( game.winner.toLowerCase().indexOf(playerTwoSearchValue.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(playerTwoSearchValue.toLowerCase()) >= 0 || playerTwoSearchValue == "") {
					if( game.location.toLowerCase().indexOf(locationSearchValue.toLowerCase()) >= 0 || locationSearchValue == "") {
						if( game.gameName.toLowerCase().indexOf(gameNameSearchValue.toLowerCase()) >= 0 || gameNameSearchValue == "") {
							if( formatDate(game.date).indexOf(formatDate(dateSearchValue)) >= 0 || dateSearchValue == "") {
								playerGamesFiltered.push(game);
							}
						}
					}
				}
			}
		});		
		
		playerObjects = playerGamesFiltered.reduce(function(result, current) {
			result[current['winner']] = result[current['winner']] || [];
			result[current['winner']].push(current);
			result[current['loser']] = result[current['loser']] || [];
			result[current['loser']].push(current);
			return result;
		}, {});
		
		
		
		playerObjects = playerGamesFiltered.reduce((acc, game) => {
		  if (acc[game.winner]) {
		    acc[game.winner].wins = acc[game.winner].wins + 1 || 1;
		  } else acc[game.winner] = { wins: 1, losses: 0};
		  if(acc[game.loser]){
		    acc[game.loser].losses = acc[game.loser]['losses'] + 1 || 1;
		  } else acc[game.loser] = { wins: 0, losses: 1};
		  return acc;
		}, {});
		
		if(minGamesValue != "") {
			for (var player in playerObjects) {
				var totalGames = playerObjects[player].wins + playerObjects[player].losses;
				if(totalGames < minGamesValue) {
					delete playerObjects[player];
				}
			}
		}
		
		playersFiltered = Object.keys(playerObjects).reduce((arr, key) => {
		  const player = {
		   alias: key,
		   wins: playerObjects[key].wins,
		   losses: playerObjects[key].losses,
		   pct: (playerObjects[key].wins / (playerObjects[key].wins + playerObjects[key].losses)).toFixed(2),
		  };
		  arr.push(player);
		  return arr;
		}, []);
		
		playersFiltered = sortJSON(playersFiltered, 'pct', '321');
		createPlayersTable(playersFiltered);
		$("#table").html(playerTable);	
		$("#gameTable").html(playerTable);		
	});*/
}
/*
var playerGames;
$("#saveFiltersButton").on("click", function() {
	if(activeFilter == 'player') {

		//playersFiltered = players;
		playerGames = games;
		
		var filter = {
			groupID: $("#player-filter-group").val(),
			locationID: $("#player-filter-location").val(),
			gameNameID: $("#player-filter-game-name").val()
		};
		
		counter = 0;
		$.each( filter, function( key, value ) {
			if(value != ""){
				counter++;
			}
		});
		
		$('#game-filter-button').html('Filter (' + counter + ')');
		
		//Start
		playerGames = playerGames.filter(function(item) {
			for (var key in filter) {
				
				if(key == 'groupID' && filter[key] != undefined && filter[key] != '') {
					
					var filterGroupID = filter[key];
					var currentGameWinnerID = item['winnerID'];
					var currentGameLoserID = item['loserID'];
					var filterGroupMembers;
					if(groups.find(group => group.id == filterGroupID)){
						filterGroupMembers = groups.find(group => group.id == filterGroupID).memberIDs;
					}
					
					if($.inArray(currentGameWinnerID, filterGroupMembers) > -1) {
						if($.inArray(currentGameLoserID, filterGroupMembers) > -1) {
							return true;
						}
					}
					
					return false;		
				}
			
				if (item[key] != filter[key] && filter[key] != undefined && filter[key] != '') {
					//Check winner and loser for player name
					if(key == 'winnerID'){
						if (item['loserID'] == filter['winnerID']) {
							return true;
						}
					}
					if(key == 'loserID'){
						if (item['winnerID'] == filter['loserID']) {
							return true;
						}
					}
					return false;
				}
			}
			return true;
		});
		//End
		
		//Start		
		playerObjects = playerGames.reduce((acc, game) => {
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
		  };
		  arr.push(player);
		  return arr;
		}, []);
		
		playersFiltered = sortJSON(playersFiltered, 'pct', '321');
		createPlayersTable(playersFiltered);
		$("#table").html(playerTable);	
		$("#gameTable").html(playerTable);
		//End
		

	}
});
*/
function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === '123' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

var lastPlayerSort = 'pct';
var sortPlayers = function(sortBy) {
	
	var sortId = $(sortBy).attr('id');
	var sortByType;
	
	if(sortId == "playerHeader") {
		sortByType = "alias";
	}
	if(sortId == "winsHeader") {
		sortByType = "wins";
	}
	if(sortId == "lossesHeader") {
		sortByType = "losses";
	}
	if(sortId == "pctHeader") {
		sortByType = "pct";
	}
	
	sortId = "#" + $(sortBy).attr('id');
	//$("#gameTableID").find(".selectedSort").removeClass("selectedSort");
   	//$(sortId).addClass("selectedSort");
	
	if(sortByType == lastPlayerSort) {
		players = sortByDec(players, sortByType);
		showPlayers();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-bottom"></span>');
		lastPlayerSort = '';
	} else {
		players = sortByAsc(players, sortByType);
		showPlayers();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-top"></span>');
		lastPlayerSort = sortByType;
	}
}