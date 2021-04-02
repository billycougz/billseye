var gameTable;
var gameFilter = `
	<nav id="gameFilter" class="navbar navbar-default">
		<!-- Title and Mobile Toggle -->
		<div class="navbar-header" style="margin-top: 7px">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#"><span class="hidden-lg">Filter Game History</span></a>
		</div>
		<!-- Filter Inputs -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<form class="navbar-form navbar" style="margin-bottom: 0; margin-top: 15px">
				<div class="form-group col-lg-2 game-filter">
					<input id="playerOneFilter" type="text" class="form-control game-filter-input" placeholder="Player 1">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="playerTwoFilter" type="text" class="form-control game-filter-input" placeholder="Player 2">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="gameNameFilter" type="text" class="form-control game-filter-input" placeholder="Game">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="locationFilter" type="text" class="form-control game-filter-input" placeholder="Location">
				</div>
				<div class="form-group col-lg-2 game-filter" style="display: none">
					<input id="dateFilter" type="date" class="form-control game-filter-input" placeholder="Date">
				</div>
				<div class="form-group col-lg-4 game-filter">
					<button id="clearFiltersButton" class="btn btn-info" type="button">Clear</button>
				</div>
				<div class="form-group col-lg-2 game-filter">
					<button id="saveFiltersButton" class="btn btn-info hidden-lg" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">Save</button>
				</div>
			</form>
		</div>
	</nav>
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
	
		var gameTableRow = $('<tr style="background-color:' + rowColor + ';color:' + rowText + '" class="gameRow" data-game-id="' + data[i].id + '" data-game-date="' + data[i].date + '"data-game-location="' + data[i].location + '" data-game-name="' + data[i].gameName + '"data-game-winner="' + data[i].winner + '"data-game-loser="' + data[i].loser + '"></tr>');
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
	var gameLocation = $(this).attr("data-game-location");
	var gameName = $(this).attr("data-game-name");
	var winner = $(this).attr("data-game-winner");
	var loser = $(this).attr("data-game-loser");
	
	$('#gameModalDate').html('<strong>Date: </strong>' + gameDate);
	$('#gameModalLocation').html('<strong>Location: </strong>' + gameLocation);
	$('#gameModalName').html('<strong>Game: </strong>' + gameName);
	$('#gameModalMatchup').html('<strong>Matchup: </strong>' + winner + ' vs ' + loser);
	$('#gameModalWinner').html('<strong>Winner: </strong>' + winner);
	$('#detailModalTitle').html('Game Details');
	$('#playerGameTableHeader').html("");
	$('#playerGameTable').html("");
}

function showGames() {
	$('#addGameTile').css("display", "none");
	createGameTable(games);
	$("#gameFilterPlaceholder").html(gameFilter);
	$("#playerFilterPlaceholder").html("");
	$("#table").html(gameTable).css("display", "block");
	filterGames();
}

function showGamesDesktop() {
	createGameTable(games);
	$("#gameFilterPlaceholderDesktop").html(gameFilter);
	$("#playerFilterPlaceholder").html("");
	$("#gameTable").html(gameTable).css("visibility", "visible");
	filterGames();
}

var gamesFiltered;
var filterGames = function(){
	$(".game-filter-input").on("keyup", function() {
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
}

var filterPlayerGames = function(){
	gamesFiltered = [];
	
	$(games).each(function(index, game){
		if( game.winner.toLowerCase().indexOf(selectedPlayerAlias.toLowerCase()) >= 0 || game.loser.toLowerCase().indexOf(selectedPlayerAlias.toLowerCase()) >= 0) {
			gamesFiltered.push(game);
		}
	});
	createGameTable(gamesFiltered);
}

//Clear filters
$(document).on('click', '#clearFiltersButton', function(){   
	$('#playerOneFilter').val('').change();
	$('#playerTwoFilter').val('').change();
	$('#locationFilter').val('').change();
	$('#gameNameFilter').val('').change();
	$('#dateFilter').val('').change();
	$('#minGamesFilter').val('').change();
	$("#playerOneFilter").trigger(jQuery.Event("keyup"));
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
	//$("#gameTableID").find(".selectedSort").removeClass("selectedSort");
   	//$(sortId).addClass("selectedSort");
	
	if(sortByType == lastSort) {
		games = sortByDec(games, sortByType);
		//showGames();
		showGamesDesktop();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-bottom"></span>');
		lastSort = '';
	} else {
		games = sortByAsc(games, sortByType);
		//showGames();
		showGamesDesktop();
		$( "#dateArrow" ).remove();
		$(sortId).append('<span class="glyphicon glyphicon-triangle-top"></span>');
		lastSort = sortByType;
	}
}


