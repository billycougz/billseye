<?php
class GroupMember {
 
    // database connection and table name
    private $conn;
    private $table_name = "GroupMember";
 
    // object properties
    public $id;
    public $name;
    public $location;
    public $gameName;
    public $member;
    public $memberID;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
    
	// read groups
	function read(){
	 
	    // select all query
	    $query = 	"SELECT Group.ID, Group.Name, Location.Name as 'Location', GameName.Name as 'GameName', Player.ID as 'MemberID', Player.Alias as 'Member'
			FROM `Group` 
			LEFT JOIN Location ON Location.ID = Group.Location
			LEFT JOIN GameName ON GameName.ID = Group.GameName
			LEFT JOIN GroupMember ON GroupMember.GroupID = Group.ID
			LEFT JOIN Player ON Player.ID = GroupMember.MemberID";

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
               GroupID=:group, MemberID=:member";
 
    // prepare query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->group=htmlspecialchars(strip_tags($this->group)); 
    $this->member=htmlspecialchars(strip_tags($this->member)); 

    // bind values
    $stmt->bindParam(":group", $this->group);
    $stmt->bindParam(":member", $this->member);
 
    // execute query
    if($stmt->execute()){
        return true;
    }
 
    return false;
     
}
	
	
}