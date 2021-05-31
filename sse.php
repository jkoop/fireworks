<?php

// modified https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

header("Cache-Control: no-cache");
header("Content-Type: text/event-stream");

$counter = rand(1, 10);

while (true) {
    // Every 5 seconds, send a "ping" event.
    if(time() % 5 == 0){
        echo ": noop\n\n";
    }

    // Send a simple message at random intervals.
    $counter--;

    if (!$counter) {
        echo 'data: This is a message at time ' . time() . "\n\n";
        $counter = rand(1, 10);
    }

    ob_end_flush();
    flush();

    // Break the loop if the client aborted the connection (closed the page)
    if(connection_aborted()) break;

    sleep(1);
}
