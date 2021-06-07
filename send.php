<?php

if(count($_POST) == 0) $_POST = json_decode(file_get_contents("php://input"), true);

$to = $_POST['to'] ?? badRequest('must set `to`');
$d = $_POST['data'] ?? badRequest('must set `data`');

if(strlen($d) > 1000) tooLarge('data longer than 1000');
if(count(glob('messages/' . $to . '-*')) >= 8) fullMailBox('mailbox too full');

$data = json_encode(json_decode($d, true) ?? $d);

mkdir('messages');

$filename = 'messages/' . $to . '-' . time() . '-' . hrtime(true);

if(!file_put_contents($filename, $data)) serverError("coudn't write to filesystem");

http_response_code(201);
exit();

function badRequest($a=''): void {
    http_response_code(400);
    die($a);
}

function tooLarge($a=''): void {
    http_response_code(413);
    die($a);
}

function serverError($a=''): void {
    http_response_code(500);
    die($a);
}

function fullMailBox($a=''): void {
    http_response_code(507);
    die($a);
}
