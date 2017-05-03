<?php

header("Content-Type:application/json");

@$id = $_REQUEST['id'];
if(empty($id))
{
    echo '[]';
    return ;
}

$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
//$conn = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS,  SAE_MYSQL_DB, SAE_MYSQL_PORT);
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql = "SELECT did,name,price,material,img_lg,detail FROM kf_dish WHERE did=$id";
$result = mysqli_query($conn,$sql);


$output = [];
while(true)
{
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }
    $output[] = $row;
}

echo json_encode($output);

?>