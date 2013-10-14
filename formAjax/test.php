<?php

header('Content-type: application/json');

$_POST['status'] = 'success';
$_POST['file'] = $_FILES;
echo json_encode($_POST);
