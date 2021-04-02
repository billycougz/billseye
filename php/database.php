<?php
class Database{
 
    // specify your own database credentials
    private $host = "localhost";
    private $db_name = "wpcougz_dartDB";
    private $username = "wpcougz_user1";
    private $password = "password1!";
    public $conn;
 
    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}
?>