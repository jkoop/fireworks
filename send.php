<?php

if(count($_POST) == 0) $_POST = json_decode(file_get_contents("php://input"), true);

$to = $_POST['to'] ?? badRequest();
$d = $_POST['data'] ?? badRequest();

if(strlen($d) > 1000) tooLarge();
if(count(glob('messages/' . $to . '-*')) >= 8) fullMailBox();

$data = json_encode(json_decode($d, true) ?? $d);

mkdir('messages');

$filename = 'messages/' . $to . '-' . time() . '-' . hrtime(true);

file_put_contents($filename, $data);

if(!file_exists($filename)) serverError();

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

function serverError(): void {
    http_response_code(500);
    die();
}

function fullMailBox(): void {
    http_response_code(507);
    die();
}
