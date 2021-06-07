<?php

if(count($_POST) == 0) $_POST = json_decode(file_get_contents("php://input"), true);

$to = trim($_POST['to']);
if($to == '') badRequest('must set ?to');
$d = array_map('trim', $_POST['data']);
if($d == '') badRequest('must set ?data');

if(strlen($d) > 1000) tooLarge('data longer than 1000');

if(!is_dir('messages/' . $to)) mkdir('messages/' . $to, 0777, true);
chdir('messages/' . $to);

if(count(scandir('.')) >= 10) fullMailBox('mailbox too full');

if(!file_put_contents(time() . '-' . hrtime(true), json_encode(json_decode($d, true) ?? $d)))
    serverError("couldn't write to filesystem");

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
