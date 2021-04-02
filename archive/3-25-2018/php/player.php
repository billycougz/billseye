<?php
class Player{
 
    // database connection and table name
    private $conn;
    private $table_name = "Player";
 
    // object properties
    public $id;
    public $fname;
    public $lname;
    public $alias;
    public $timestamp;
    public $wins;
    public $losses;
    public $pct;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
    
	// read players
	function read(){
	 
	    // select all query
	    $query = "
SELECT WinnerQuery. * , LoserQuery.Losses, ROUND(
WinnerQuery.Wins / ( WinnerQuery.Wins + LoserQuery.Losses ), 2
) AS  PCT
FROM (

SELECT Player. * , COUNT( Game.WinnerID ) AS  'Wins'
FROM Player
LEFT JOIN Game ON Player.ID = Game.WinnerID
GROUP BY Player.ID
) AS WinnerQuery
LEFT JOIN (

SELECT Player. * , COUNT( Game.LoserID ) AS  'Losses'
FROM Player
LEFT JOIN Game ON Player.ID = Game.LoserID
GROUP BY Player.ID
) AS LoserQuery ON WinnerQuery.ID = LoserQuery.ID
ORDER BY PCT DESC
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
                FirstName=:fname, LastName=:lname, Alias=:alias";
 
    // prepare query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->fname=htmlspecialchars(strip_tags($this->fname));
    $this->lname=htmlspecialchars(strip_tags($this->lname));
    $this->alias=htmlspecialchars(strip_tags($this->alias));
 
    // bind values
    $stmt->bindParam(":fname", $this->fname);
    $stmt->bindParam(":lname", $this->lname);
    $stmt->bindParam(":alias", $this->alias);
 
    // execute query
    if($stmt->execute()){
        return true;
    }
 
    return false;
     
}
}