<?php /*
    require_once 'dbconnect.php';

    //fetch table rows from mysql db
    $table = '';
    $sql = "select * from Player";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

    //create an array
    $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
    echo json_encode($emparray);

    //close the db connection
    mysqli_close($connection);
*/ ?>

<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once 'database.php';
include_once 'player.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$player = new Player($db);
 
// query players
$stmt = $player->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // products array
    $player_arr=array();
    $player_arr["data"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $player_item=array(
            "id" => $ID,
            "fname" => $FirstName,
            "lname" => $LastName,
            "alias" => $Alias,
            "timestamp" => $Timestamp,
            "wins" => $Wins,
            "losses" => $Losses,
            "pct" => $PCT
        );
 
        array_push($player_arr["data"], $player_item);
    }
 
    echo json_encode($player_arr);
}
 
else{
    echo json_encode(
        array("message" => "No players found.")
    );
}
?>