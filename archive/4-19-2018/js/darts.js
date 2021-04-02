/**
 * Billseye
 * Dart Database & Dashboard
 * 
 * Billy Cougan
 * February, March, April 2018
 */

//-------------------------------------------------------------------------------- On page load
setTimeout(transitionLogo, 1000);
resetData();
updateData();
//-------------------------------------------------------------------------------- Header and footer

$("#footer .nav a").on("click", function(){
	
	var selectedId = $(this).attr('id');
	
	if(selectedId == 'mobile-add-game') {
		hideData();
	}
	
	if(selectedId == 'mobile-game-history') {
		$('#addGameTile').css('display', 'none');
		showGamesDesktop();
	}
	
	if(selectedId == 'mobile-leaderboard') {
		$('#addGameTile').css('display', 'none');
		showPlayersDesktop();
	}

	$("#bottomNav").find(".active").removeClass("active");
	$(this).addClass("active");
});


$("#top-nav .nav a").on("click", function(){
   $(".nav").find(".active").removeClass("active");
   $(this).parent().addClass("active");
});

function transitionLogo(){
		$("#logoText").fadeOut();
		var headerMargin = $("#header-container").css("margin-left");
		var contentMargin = $("#main-content").css("margin-left");
		headerMargin = (parseInt(headerMargin.replace(/px/,"")) - parseInt(contentMargin.replace(/px/,""))) + "px";
		$("#header-container").animate({right: headerMargin}, 3000);
		var img = document.getElementById('logo'); 
		$(img).animate({height: "50px"}, 3000);
		setTimeout(resetHeaderCSS, 3000);
}

function resetHeaderCSS(){
	if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
		$("#top-nav").fadeIn().css("display","inline-block");;
	}
	if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
		$("#addAppButton").fadeIn();
		$("#test-button-mobile").fadeIn();
	}
	$("#bottomNav").fadeIn();
	var containerWidth = $("#main-content").css("width");
	$("#header-container").css("width",containerWidth);
	$("#header-container").css("margin","");
	$("#header-container").css("position","");
	$("#header-container").css("right","");
	$("#addGameTile").css("display","inline-block");
	hideData();
	if(screen.width >= 1200){
		showGamesDesktop();
	}
}

//-------------------------------------------------------------------------------- Enable and disable submit button
//Disable submit button on page load
$('#submitGameButton').prop('disabled', true);

//Enable submit button if all inputs are completed
$('select').change(function(){ 
	if( !($('#winnerSelect').val() == "" ||  $('#loserSelect').val() == "" || $('#locationSelect').val() == "" || $('#gameNameSelect').val() == "") ) {
		$('#submitGameButton').prop('disabled', false);
	} else {
		$('#submitGameButton').prop('disabled', true);
	}
});


//-------------------------------------------------------------------------------- Update data
function updateData(){
	getGames();
	getPlayers();
	getEvents();
	getLocations();
	getGameNames();
}

function resetData() {
	setDate();
	$('#winnerSelect').val('').change();
	$('#loserSelect').val('').change();
	$('#locationSelect').val('').change();
	$('#eventSelect').val('').change();
	$('#gameNameSelect').val('').change();
	$('#testSelect').val('0').change();
	//$('#durationInput').val('');
	//$('#timerButton').css('display', 'inline-block');
	//$('#timerInnerContainer').css('display', 'none');
	//$('#timerButton').html('Start Timer');

	$('#winnerSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Player</option>');
	$('#loserSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Player</option>');
	$('#eventSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Event</option>');
	$('#locationSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Location</option>');
	$('#gameNameSelect').find('option').remove().end().append('<option></option><option class="addNewOption">(+) Add New Game</option>');
	//$('#quickAlert').css("display", "none");
	//hideData();
}

function setDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {dd = '0'+dd} 
	if(mm<10) {mm = '0'+mm} 
	today = yyyy + '-' + mm + '-' + dd;
	document.querySelector("#today").value = today;
}


//-------------------------------------------------------------------------------- Event tiggered functions
//Launch add modal on click of add new player, event, location, or game name option in select box
$(window).click(function(e) {
    if(e.target.innerHTML == '(+) Add New Location' || e.target.innerHTML == '(+) Add New Event' || e.target.innerHTML == '(+) Add New Game' || e.target.innerHTML == '(+) Add New Player'){
        hideModalInputs();
        $('#objectAdded').css("display", "none");
        $("#addModal").modal('show');
    }
    
    if(e.target.innerHTML == '(+) Add New Location'){
    	$('#addModalTitle').html('Add New Location');
    	$('#addLocationInput').css('display', 'table');
    	$('#locationSelect').val('').change();
    }
    if(e.target.innerHTML == '(+) Add New Event'){
    	$('#addModalTitle').html('Add New Event');
    	$('#addEventInput').css('display', 'table');
    	$('#eventSelect').val('').change();
    }
    if(e.target.innerHTML == '(+) Add New Game'){
    	$('#addModalTitle').html('Add New Game');
    	$('#addGameNameInput').css('display', 'table');
    	$('#gameNameSelect').val('').change();
    }
    if(e.target.innerHTML == '(+) Add New Player'){
    	$('#addModalTitle').html('Add New Player');
    	$('#addPlayerInputs').css('display', 'table');
    	$('#addPlayerInputs').css('width', '100%');
   	if( $("#winnerSelect").val() == "(+) Add New Player" ){
		$('#winnerSelect').val('').change();
	}
	if( $("#loserSelect").val() == "(+) Add New Player" ){
    		$('#loserSelect').val('').change();
    	}
    }
});

//Populate test data on click of button
$(document).on('click', '.test-button-class', function(){   
	$('#locationSelect').val('1').change();
	$('#eventSelect').val('1').change();
	$('#gameNameSelect').val('7').change();
	$('#winnerSelect').val('1').change();
	$('#loserSelect').val('2').change();
	$('#testSelect').val('1').change();
	$('#testAlert').css("display", "block");
});

//Launch add email modal on click of button
function addEmailButtonClicked() {
        hideModalInputs();
        $('#objectAdded').css("display", "none");
        $("#addModal").modal('show');
        $('#addModalTitle').html('Subscribe To Email Notifications');
    	$('#addEmailInputs').css('display', 'table');
    	$('#addEmailInputs').css('width', '100%');
}

//Launch add app modal on click of button
$(document).on('click', '#addAppButton', function(){   
	$("#addAppModal").modal('show');
});

//Launch add app modal on click of button
$(document).on('click', '.gameRow', function(){   
	$("#gameModal").modal('show');
});

//Launch add app modal on click of button
$(document).on('click', '.playerRow', function(){   
	$("#gameModal").modal('show');
});

//Display the add game form and hide other forms on click of Add Game
function hideData() {
	$('#addGameTile').css("display", "block");
	$("#gameTable").html("<table class='table'></table>").css("visibility", "hidden");
	$("#table").html("<table class='table'></table>").css("display", "none");
	$("#gameFilterPlaceholder").html("");
	$("#playerFilterPlaceholder").html("");
}

//Reset the state of the add object modal
function hideModalInputs(){
    	$('#addEventInput').css('display', 'none');
    	$('#addLocationInput').css('display', 'none');
    	$('#addGameNameInput').css('display', 'none');
    	$('#addPlayerInputs').css('display', 'none');
    	$('#addEmailInputs').css('display', 'none');
}

//Clear data from the add object modal inputs
function clearModalInputs() {
	$('.modalInput').val('');
}

$(document).on('click', '#quickButton', function(){   
	$('#locationSelect').val('1');
	$('#eventSelect').val('1');
	$('#gameNameSelect').val('7');
	$(".hideIfQuick").css("display", "none");
	$('#quickAlert').css("display", "block");
});



//-------------------------------------------------------------------------------- Timer
var timerStarted;
var timerInterval;
var startStamp;
$("#timerButton").on("click", function(){
	
	var minutesValue;
	var secondsValue;

	var minutesCounter = $('#minutesCounter');
	var secondsCounter = $('#secondsCounter');
	var timerInnerContainer = $('#timer-inner-container');
	var timerButton = $('#timerButton');
	var durationInput = $('#durationInput');
	
	//On click of the timer button, toggle the timer (start or stop)
	if(timerStarted) {
		timerStarted = false;
		$('#timer-container').removeClass('started');
		$('#timer-container').addClass('stopped');
		clearInterval(timerInterval);
		durationInput.val( minutesCounter.text() + secondsCounter.text() );
	} else {
		timerStarted = true;
		startStamp = new Date();
		$('#timer-container').removeClass('initial');
		$('#timer-container').addClass('started');
		timerButton.html('Stop Timer');
		secondsValue = 0;
		minutesValue = 0;
		
		minutesCounter.html('00:');
		secondsCounter.html('00');
		
		//Interval set to run every second on timer start
		timerInterval = setInterval(function(){
		
			//Take new timestamp every seconds
			var currentStamp = new Date();
	   
		        //Time difference between timer start and current time (in seconds)
		        var stampDifference = (currentStamp.getTime() - startStamp.getTime()) / 1000;
			
			//Convert time from seconds to minutes and seconds
			minutesValue = Math.floor(stampDifference / 60);
			secondsValue = stampDifference % 60;

			//Display minutes - add a zero if minutes are less than 10
			if(minutesValue < 10) {
				minutesCounter.html('0' + minutesValue + ':');
			} else {
				minutesCounter.html(minutesValue + ':');
			}
			
			//Display seconds - add a zero if minutes are less than 10
			if(secondsValue < 10) {
				secondsCounter.html('0' + secondsValue.toFixed(0));
			} else {
				secondsCounter.html(secondsValue.toFixed(0));
			}
		},1000);
	}
	
});

$("#timer-cancel-button").on("click", function(){
	timerStarted = false;
	clearInterval(timerInterval);
	$('#durationInput').val('');
	$('#timer-container').removeClass('started');
	$('#timer-container').removeClass('stopped');
	$('#timer-container').addClass('initial');
	$('#timerButton').html('Start Timer');
});




//-------------------------------------------------------------------------------- Helper functions
function formatDate(inputDate) {
    var date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        // Months use 0 index.

        return (month[1] ? month : '0' + month[0]) + '/' +
           (day[1] ? day : '0' + day[0]) + '/' + 
           date.getFullYear();
    }
}

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

//Function makes form values to json format
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};