<?php

$to = $_POST['to'] ?? badRequest();
$data = $_POST['data'] ?? badRequest();

if(strlen($data) > 1000) tooLarge();
if(count(glob('messages/' . $to . '-*')) >= 8) tooOften();

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

function tooOften(): void {
    http_response_code(429);
    die();
}

function serverError(): void {
    http_response_code(500);
    die();
}
