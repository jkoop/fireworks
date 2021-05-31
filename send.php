<?php

$to = $_POST['to'] ?? badRequest();
$data = $_POST['data'] ?? badRequest();

if(strlen($data) > 1000) tooLarge();
if(count(glob('messages/' . $to . '-*')) >= 8) tooOften();

file_put_contents('messages/' . $to . '-' . rand(1000000000000000, 9999999999999999), $data);
http_response_code(201);
exit();

function badRequest(): void {
    http_response_code(400);
    die();
}

function tooLarge(): void {
    http_response_code(413);
    die();
}

function tooOften(): void {
    http_response_code(429);
    die();
}
