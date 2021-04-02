<?php
class Group {
 
    // database connection and table name
    private $conn;
    private $table_name = "`Group`";
 
    // object properties
    public $id;
    public $name;
    public $location;
    public $gameName;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
    
	// read groups
	function read(){
	 
	    // select all query
	    $query = "SELECT Group.ID, Group.Name, Location.Name as 'Location', GameName.Name as 'GameName' FROM `Group` LEFT JOIN Location ON Location.ID = Group.Location LEFT JOIN GameName ON GameName.ID = Group.GameName";

	    // prepare query statement
	    $stmt = $this->conn->prepare($query);
	 
	    // execute query
	    $stmt->execute();
	 
	    return $stmt;
	}
	
	
function create(){
 
    // query to insert record
    $query = "INSERT INTO
                " . $this->table_name . "
            SET
                Name=:name, Location=:location, GameName=:gameName";
 
    // prepare query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->name=htmlspecialchars(strip_tags($this->name)); 
    $this->location=htmlspecialchars(strip_tags($this->location)); 
    $this->gameName=htmlspecialchars(strip_tags($this->gameName)); 
    
    // bind values
    $stmt->bindParam(":name", $this->name);
    $stmt->bindParam(":location", $this->location);
    $stmt->bindParam(":gameName", $this->gameName);
 
    // execute query
    if($stmt->execute()){
        return true;
    }
 
    return false;
     
}
	
	
}