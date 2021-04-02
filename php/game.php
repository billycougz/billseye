<?php
class Game{
 
    // database connection and table name
    private $conn;
    private $table_name = "Game";
 
    // object properties
    public $id;
    public $date;
    public $locationID;
    public $location;
    public $event;
    public $gameNameID;
    public $gameName;
    public $winnerID;
    public $winner;
    public $loserID;
    public $loser;
    public $duration;
    public $test;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
    
	// read games
	function read(){
	 
	    // select all query
	    $query = "
SELECT Game.ID, Game.Date, Game.LocationID, Game.Location, Game.Duration, Game.GameNameID, Game.Game, Game.WinnerID, Game.Winner, Loser.LoserID, Loser.Loser
FROM (

SELECT Game.ID, Game.Date, Game.Duration, Player.ID AS 'WinnerID', Player.Alias AS  'Winner', Location.ID AS 'LocationID', Location.Name AS  'Location', GameName.ID AS  'GameNameID', GameName.Name AS  'Game'
FROM Game
LEFT JOIN Player ON Player.ID = Game.WinnerID
LEFT JOIN Event ON Event.ID = Game.EventID
LEFT JOIN Location ON Location.ID = Game.LocationID
LEFT JOIN GameName ON GameName.ID = Game.GameID
) AS Game
LEFT JOIN (

SELECT Game.ID, Player.ID AS 'LoserID', Player.Alias AS  'Loser'
FROM Game
LEFT JOIN Player ON Game.LoserID = Player.ID
) AS Loser ON Game.ID = Loser.ID
ORDER BY Game.Date DESC
	    ";
	 
	    // prepare query statement
	    $stmt = $this->conn->prepare($query);
	 
	    // execute query
	    $stmt->execute();
	 
	    return $stmt;
	}
	
	
	
// create game
function create(){
 
    // query to insert record
    $query = "INSERT INTO
                " . $this->table_name . "
            SET
                Date=:date, LocationID=:location, EventID=:event, GameID=:gameName, WinnerID=:winner, LoserID=:loser, Duration=:duration, Test=:test";
 
    // prepare query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->date=htmlspecialchars(strip_tags($this->date));
    $this->location=htmlspecialchars(strip_tags($this->location));
    $this->event=htmlspecialchars(strip_tags($this->event));
    $this->gameName=htmlspecialchars(strip_tags($this->gameName));
    $this->winner=htmlspecialchars(strip_tags($this->winner));
    $this->loser=htmlspecialchars(strip_tags($this->loser));
    $this->test=htmlspecialchars(strip_tags($this->test));
    $this->duration=htmlspecialchars(strip_tags($this->duration));
 
    // bind values
    $stmt->bindParam(":date", $this->date);
    $stmt->bindParam(":location", $this->location);
    $stmt->bindParam(":event", $this->event);
    $stmt->bindParam(":gameName", $this->gameName);
    $stmt->bindParam(":winner", $this->winner);
    $stmt->bindParam(":loser", $this->loser);
    $stmt->bindParam(":test", $this->test);
    $stmt->bindParam(":duration", $this->duration);
    
    $emailQuery = "
SELECT MailingList.Address
FROM MailingList
";
    //$emailStmt = $this->conn->prepare($emailQuery);
 $con=mysqli_connect("localhost","wpcougz_user1","password1!","wpcougz_dartDB");

$result=mysqli_query($con,$emailQuery);

while($row = mysqli_fetch_assoc($result)){
    $to = $to . "," . $row['Address'];
}

	$winnerQuery = "SELECT Player.Alias From Player Where Player.Id ='" . $this->winner . "'";
	$winnerName = mysqli_query($con,$winnerQuery);
	$winnerName = mysqli_fetch_assoc($winnerName);
	$winnerName = $winnerName['Alias'];
	$loserQuery = "SELECT Player.Alias From Player Where Player.Id ='" . $this->loser . "'";
	$loserName = mysqli_query($con,$loserQuery);
	$loserName = mysqli_fetch_assoc($loserName);
	$loserName = $loserName['Alias'];

$headers = "BCC: $to";

    // execute query
    if($stmt->execute()){
    	$msg = "Winner: " . $winnerName . " | Loser: " . $loserName;
    	mail("3155349166@vzwpix.com","Billseye Game Added",$msg, $headers);
        return true;
    }
 
    return false;
     
}
	
	
	
	
	
}