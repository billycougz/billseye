<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once 'database.php';
include_once 'gamename.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$gamename = new GameName($db);
 
// query gamenames
$stmt = $gamename->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // products array
    $gamename_arr=array();
    $gamename_arr["data"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $gamename_item=array(
            "id" => $ID,
            "name" => $Name
        );
 
        array_push($gamename_arr["data"], $gamename_item);
    }
 
    echo json_encode($gamename_arr);
}
 
else{
    echo json_encode(
        array("message" => "No gamenames found.")
    );
}
?>