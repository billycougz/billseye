<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once 'database.php';
include_once 'group.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$group = new Group($db);
 
// query groups
$stmt = $group->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    $group_arr=array();
    $group_arr["data"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $group_item=array(
            "id" => $ID,
            "name" => $Name,
            "location" => $Location,
            "gameName" => $GameName
        );
 
        array_push($group_arr["data"], $group_item);
    }
 
    echo json_encode($group_arr);
}
 
else{
    echo json_encode(
        array("message" => "No groups found.")
    );
}
?>