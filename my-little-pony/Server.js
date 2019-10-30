"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ws_1 = require("ws");
var gifts_json_1 = __importDefault(require("./src/assets/gifts.json"));
var immer_1 = require("immer");
var initialState = { gifts: gifts_json_1["default"] };
var wss = new ws_1.Server({ port: 5001 });
console.log('WebSocket server on port 5001');
var connections = [];
var history = [];
wss.on('connection', function (ws) {
    connections.push(ws);
    console.log('New Disturbance in the Force!');
    ws.on('message', function (message) {
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
    ws.on('close', function () {
        var idx = connections.indexOf(ws);
        if (idx !== -1) {
            connections.splice(idx, 1);
        }
    });
    // Sends all the patches we received so far.
    ws.send(JSON.stringify(history));
});
function compressHistory(currentPatches) {
    var _a = immer_1.produceWithPatches(initialState, function (draft) {
        return immer_1.applyPatches(draft, currentPatches);
    }), patches = _a[1];
    console.log("compressed from " + currentPatches.length + " to " + patches.length + " patches.");
    return patches;
}
setInterval(function () {
    history = compressHistory(history);
}, 5000);
