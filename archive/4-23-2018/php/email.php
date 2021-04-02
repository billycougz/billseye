<?php
class Email {
	
	private $conn;
	private $table_name = "MailingList";
	public $address;
	//public $playerID;
	
	//$emailQuery = "
	//	SELECT MailingList.Address
	//	FROM MailingList
	//";
	
	//$con=mysqli_connect("localhost","wpcougz_user1","password1!","wpcougz_dartDB");
	//$result=mysqli_query($con,$emailQuery);
	
	//while($row = mysqli_fetch_assoc($result)){
	//	$to = $to . "," . $row['Address'];
	//}
	
	//$headers = "BCC: $to";
	//$msg = "A game was added to the BILLSEYE database.";
	//mail("3155349166@vzwpix.com","Game Added",$msg, $headers);
	
	public function __construct($db){
		$this->conn = $db;
	}
	
	function create(){
	 
	    $query = "INSERT INTO
	                " . $this->table_name . "
	            SET
	                Address=:address";
	 
	    // prepare query
	    $stmt = $this->conn->prepare($query);
	 
	    // sanitize
	    $this->address=htmlspecialchars(strip_tags($this->address)); 
	    
	    // bind values
	    $stmt->bindParam(":address", $this->address);
	 
	    // execute query
	    if($stmt->execute()){
	        return true;
	    }
	 
	    return false;
	     
	}

}
?>