"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var wss = new ws_1.Server({ port: 5001 });
console.log('WebSocket server on port 5001');
var connections = [];
var history = [];
wss.on('connection', function (ws) {
    connections.push(ws);
    console.log('New Disturbance in the Force!', { ws: ws });
    wss.on('message', function (message) {
        console.log('Yo', { message: message });
        // Append it to the rest of the patches
        history.push.apply(history, JSON.parse(message));
        // Broadcast the patch on all the connections, except the source.
        connections
            .filter(function (client) { return client !== ws; })
            .forEach(function (client) {
            client.send(message);
        });
    });
    wss.on('close', function () {
        var idx = connections.indexOf(ws);
        if (idx !== -1) {
            connections.splice(idx, 1);
        }
    });
    // Sends all the patches we received so far.
    ws.send(JSON.stringify(history));
});
