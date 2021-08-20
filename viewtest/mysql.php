<?php
/*
 * @Author: your name
 * @Date: 2021-08-19 23:57:35
 * @LastEditTime: 2021-08-20 18:35:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\viewtest\mysql.php
 */
$servername = "mysql";
$username = "root";
$password = "123456";
 
// 创建连接
$conn = new mysqli($servername, $username, $password);
 

// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
} 
echo "mysql connected successfully!";
?>
