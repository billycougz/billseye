var playerTable;
var playerFilter = `
	<nav id="playerFilter" class="navbar navbar-default">
		<!-- Title and Mobile Toggle -->
		<div class="navbar-header" style="margin-top: 7px">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#"><span class="hidden-lg"> Filter Leaderboard</span></a>
		</div>
		<!-- Filter Inputs -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
			<form class="navbar-form navbar" style="margin-bottom: 0; margin-top: 15px">
				<div class="form-group col-lg-2 game-filter">
					<input id="playerOneFilter" type="text" class="form-control player-filter-input" placeholder="Player 1">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="playerTwoFilter" type="text" class="form-control player-filter-input" placeholder="Player 2">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="gameNameFilter" type="text" class="form-control player-filter-input" placeholder="Game Name">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="locationFilter" type="text" class="form-control player-filter-input" placeholder="Location">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="minGamesFilter" type="text" class="form-control player-filter-input" placeholder="Min Games">
				</div>
				<div class="form-group col-lg-2 game-filter" style="display: none">
					<input id="dateFilter" type="date" class="form-control player-filter-input" placeholder="Date">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<button id="clearFiltersButton" class="btn btn-info" type="button">Clear</button>
				</div>
				<div class="form-group col-lg-2 game-filter">
					<button id="saveFiltersButton" class="btn btn-info hidden-lg" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">Save</button>
				</div>
			</form>
		</div>
	</nav>
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
	
	filterPlayerGames();
	$('#gameModalMatchup').html('');
	$('#gameModalDate').html('<strong>Name: </strong>' + fname + " " + lname);
	$('#gameModalLocation').html('<strong>Alias: </strong>' + selectedPlayerAlias);
	$('#gameModalName').html('<strong>Wins: </strong>' + wins);
	$('#gameModalWinner').html('<strong>Losses: </strong>' + losses);
	$('#detailModalTitle').html('Player Details');
	$('#playerGameTableHeader').html("<strong>" + selectedPlayerAlias + "'s " + "Game History</strong>");
	$('#playerGameTable').html(gameTable);
	selectedPlayerAlias = null;
}

function showPlayers() {
	$('#addGameTile').css("display", "none");
	createPlayersTable(players);
	$("#playerFilterPlaceholder").html(playerFilter);
	$("#gameFilterPlaceholder").html("");
	$("#table").html(playerTable).css("display", "block");
	filterPlayers();
}

function showPlayersDesktop() {
	createPlayersTable(players);
	$("#gameFilterPlaceholderDesktop").html(playerFilter);
	$("#gameTable").html(playerTable).css("visibility", "visible");
	filterPlayers();
}

var playerGamesFiltered;
var playerObjects;
var playersFiltered;
var filterPlayers = function(){
	$(".player-filter-input").on("keyup", function() {
		playerGamesFiltered = [];
		var playerOneSearchValue = $("#playerOneFilter").val();
		var playerTwoSearchValue = $("#playerTwoFilter").val();
		var locationSearchValue = $("#locationFilter").val();
		var dateSearchValue = $("#dateFilter").val();
		var gameNameSearchValue = $("#gameNameFilter").val();
		var minGamesValue = $("#minGamesFilter").val();

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
		
		/*playerObjects = playerGamesFiltered.reduce(function(result, current) {
			result[current['winner']] = result[current['winner']] || [];
			result[current['winner']].push(current);
			result[current['loser']] = result[current['loser']] || [];
			result[current['loser']].push(current);
			return result;
		}, {});*/
		
		
		
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
	});
}


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
		//showPlayers();
		showPlayersDesktop();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-bottom"></span>');
		lastPlayerSort = '';
	} else {
		players = sortByAsc(players, sortByType);
		//showPlayers();
		showPlayersDesktop();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-top"></span>');
		lastPlayerSort = sortByType;
	}
}