var playerTable;
var playerFilter = `
	<nav id="playerFilter" class="navbar navbar-default">
		<!-- Title and Mobile Toggle -->
		<div class="navbar-header" style="margin-top: 7px">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">Filter<span class="hidden-lg"> Leaderboard</span></a>
		</div>
		<!-- Filter Inputs -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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
					<input id="minGamesFilter" type="text" class="form-control player-filter-input" placeholder="Minimum Games">
				</div>
				<div class="form-group col-lg-2 game-filter" style="display: none">
					<input id="dateFilter" type="date" class="form-control player-filter-input" placeholder="Date">
				</div>
				<div class="col-lg-1 game-filter">
					<button id="clearFiltersButton" class="btn btn-info" type="button">Clear</button>
				</div>
			</form>
		</div>
	</nav>
`;

function createPlayersTable(players) {
	playerTable = `<table class='table'><tr><th>#</th><th>Player</th><th>W</th><th>L</th><th>Pct</th></tr><tbody id='playerTable'>`;
	for (var i = 0; i < players.length; i++) {
		playerTable+="<tr>";
		playerTable+="<td>"+ (i+1) +"</td>";
		playerTable+="<td>"+players[i].alias+"</td>";
		playerTable+="<td>"+players[i].wins+"</td>";
		playerTable+="<td>"+players[i].losses+"</td>";
		playerTable+="<td>"+players[i].pct+"</td>";
		playerTable+="</tr>";
	}
	playerTable+="</tbody></table>";
}

function showPlayers() {
	$('#formID').css("display", "none");
	createPlayersTable(players);
	$("#playerFilterPlaceholder").html(playerFilter);
	$("#gameFilterPlaceholder").html("");
	$("#table").html(playerTable);
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
	});
}


function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === '123' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}