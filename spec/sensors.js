#! /usr/bin/env node

function apiUrl(tenant, username, password, token, base) {
    if (typeof base === 'undefined') {
        base = 'things.apps.bosch-iot-cloud.com';
        base = 'localhost:8080';
    }

    const url = 'ws://' + tenant +
        '%5c' + username + ':' + password +
        '@' + base + '/ws/1?x-cr-api-token=' + token;
    return url;
}

function onMessage(data) {
    if (data == 'START-SEND-EVENTS:ACK') {
        console.log("[WS] Acknowledged")
    } else {

    }

    try {
        obj = JSON.parse(data);
        // parse data from feature updates
        thingId = obj.topic.match('(.+)/things/twin/events/modified')[1];
        thingFeature = obj.path.match('/features/(.+)')[1];
        thingFeatureProperties = obj.value.properties;
        if (!thingId || !thingFeature) {
            return;
        }
        return { id: thingId, feature: thingFeature, properties: thingFeatureProperties };
    } catch (e) {
        return; // ignore non-JSON or non-feature messages
    }
}

const WebSocket = require('ws');

function main() {
    const thingsAPIToken = 'db7f4e0cca344d32be72914311f1055f';
    const thingsUserTenant = '87BF11FF7172AF7C6A086B5';
    const thingsUserName = 'bcx18';
    const thingsPassword = 'bcx18!Open2';

    const wsUrl = apiUrl(thingsUserTenant, thingsUserName, thingsPassword, thingsAPIToken);
    console.log('url', wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.on('open', function open() {
        console.log("[WS] Established");
        ws.send('START-SEND-EVENTS');
    });

    ws.on('message', function incoming(data) {
        const payload = onMessage(data);

        console.log(JSON.stringify(payload));
    });
}

if (!module.parent) {
    main();
}

