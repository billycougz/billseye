<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once 'database.php';
 
// instantiate game object
include_once 'game.php';
 
$database = new Database();
$db = $database->getConnection();
 
$game = new Game($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// set game property values
$game->date = $data->date;
$game->location = $data->location;
$game->event = $data->event;
$game->gameName = $data->gameName;
$game->winner = $data->winner;
$game->loser = $data->loser;
$game->test = $data->test;
$game->duration = $data->duration;

// create the game
if($game->create()){
    echo '{';
        echo '"message": "Game was created."';
    echo '}';
}
 
// if unable to create the game, tell the user
else{
    echo '{';
        echo '"message": "Unable to create game."';
    echo '}';
}
?>