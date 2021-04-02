<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once 'database.php';
$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

// Add player
if($data->fname){
	include_once 'player.php';
	$player = new Player($db);
	$object = $player;
	$object->fname = $data->fname;
	$object->lname = $data->lname;
	$object->alias = $data->alias;
}
 
// Add event
if($data->eventName){
	include_once 'event.php';
	$object = new Event($db);
	$object->name = $data->eventName;
}

// Add game name
if($data->gameName){
	include_once 'gamename.php';
	$object = new GameName($db);
	$object->name = $data->gameName;
}

// Add location
if($data->locationName){
	include_once 'location.php';
	$object = new Location($db);
	$object->name = $data->locationName;
}

// Add email address
if($data->address){
	include_once 'email.php';
	$object = new Email($db);
	$object->address = $data->address;
}

// Add group
if($data->groupNameInput){
	include_once 'group.php';
	$object = new Group($db);
	$object->name = $data->groupNameInput;
	$object->location = $data->primaryLocationInput;
}

// Add group member
if($data->joinGroupPlayerInput){
	include_once 'group-member.php';
	$object = new GroupMember($db);
	$object->member = $data->joinGroupPlayerInput;
	$object->group = $data->joinGroupGroupInput;
}

// create player
if($object->create()){
    echo '{';
        echo '"message": "Player was created."';
    echo '}';
}

// if unable to create the player, tell the user
else{
    echo '{';
        echo '"message": "Unable to create player."';
    echo '}';
}
?>