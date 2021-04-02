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
			<a class="navbar-brand" href="#">Filter<span class="hidden-lg"> Games</span></a>
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
					<input id="gameNameFilter" type="text" class="form-control game-filter-input" placeholder="Game Name">
				</div>
				<div class="form-group col-lg-2 game-filter">
					<input id="locationFilter" type="text" class="form-control game-filter-input" placeholder="Location">
				</div>
				<div class="form-group col-lg-2 game-filter" style="display: none">
					<input id="dateFilter" type="date" class="form-control game-filter-input" placeholder="Date">
				</div>
				<div class="col-lg-2 game-filter">
					<button id="clearFiltersButton" class="btn btn-info" type="button">Clear</button>
				</div>
			</form>
		</div>
	</nav>
`;

function createGameTable(data) {
	gameTable = `<table id="gameTableID" class='table'><tr><th>#</th><th>Date</th><th>Winner</th><th>Loser</th></tr><tbody id='gameTable'>`;
	for (var i = 0; i < data.length; i++) {
		gameTable+="<tr>";
		gameTable+="<td>"+ (i+1) +"</td>";
		var date = new Date(data[i].date);
		date.setDate(date.getDate() + 1);
		gameTable+="<td>"+ formatDate(date)+"</td>";
		gameTable+="<td>"+data[i].winner+"</td>";
		gameTable+="<td>"+data[i].loser+"</td>";
		gameTable+="</tr>";
	}
	gameTable+="</tbody></table>";
}

function showGames() {
	$('#formID').css("display", "none");
	createGameTable(games);
	$("#gameFilterPlaceholder").html(gameFilter);
	$("#playerFilterPlaceholder").html("");
	$("#table").html(gameTable);
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
		$("#table").html(gameTable);		
	});
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