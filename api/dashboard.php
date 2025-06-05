<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");

$users = validate_token(); 

Response::showSuccessMessage('successfully fetched dashboard data',200, $users);
