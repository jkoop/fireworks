<?php

set_time_limit(0);
header("Cache-Control: no-cache");
header("Content-Type: text/event-stream");

$counter = rand(1, 10);

while (true) {
    // Every 15 seconds, send a "ping" event.
    if(time() % 15 == 0){
        echo ": noop\n\n";
    }

    // Send new messages
    $files = glob('messages/' . $_GET['to'] . '-*');
    foreach($files as $file){
        $d = file_get_contents($file);
        $data = json_decode($d, true) ?? json_encode($d);
        echo "data: " . json_encode($data) . "\n\n";
        unlink($file);
    }

    ob_end_flush();
    flush();

    // Break the loop if the client aborted the connection (closed the page)
    if(connection_aborted()) break;

    sleep(1);
}
