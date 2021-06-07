<?php

set_time_limit(0);
header("Cache-Control: no-cache");
header("Content-Type: text/event-stream");

$scriptStart = time();
$noop = 0;

echo ": ping\n\n";
ob_end_flush();
flush();

if(!is_dir('messages/' . trim($_GET['to']))) mkdir('messages/' . trim($_GET['to']), 0777, true);
chdir('messages/' . trim($_GET['to']));

while (true) {
    // Every 10 seconds, send a "ping" event.
    if(time() % 10 == 0 && $noop != time()){
        echo ": ping\n\n";
        $noop = time();
    }

    // Send new messages
    $files = scandir('.');
    if(count($files) > 2)
    foreach($files as $file){
        if(is_dir($file)) continue;
        $d = file_get_contents($file);
        $data = json_decode($d, true) ?? implode("\n", array_map('trim', explode("\n", $d)));
        if(is_array($data)) $data['time'] = (int)explode('-', $file)[0];
        echo "data: " . json_encode($data) . "\n\n";
        unlink($file);
    }

    ob_end_flush();
    flush();

    // Break the loop if the client aborted the connection (closed the page) or after 4 hours
    if(connection_aborted()) break;
    if($scriptStart + 14400 < time()) break; // 60 * 60 * 4

    usleep(200000); // 0.20 seconds
}
