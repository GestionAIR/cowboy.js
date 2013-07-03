<?php

header('Content-type: application/json');

$_POST['status'] = 'success';
echo json_encode($_POST);
