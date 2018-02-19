
const noflo = require('noflo');

function onMessage(data) {
    console.log('on message');

    if (data == 'START-SEND-EVENTS:ACK') {
        console.log("[WS] Acknowledged");
    } else {

    }

    try {
        const obj = JSON.parse(data);
        // parse data from feature updates
        const thingId = obj.topic.match('(.+)/things/twin/events/modified')[1];
        const thingFeature = obj.path.match('/features/(.+)')[1];
        const thingFeatureProperties = obj.value.properties;
        if (!thingId || !thingFeature) {
            return;
        }
        return { id: thingId, feature: thingFeature, properties: thingFeatureProperties };
    } catch (e) {
        return; // ignore non-JSON or non-feature messages
    }
}

exports.getComponent = () => {
  console.log('getcomp');
  try {
    const c = noflo.asComponent(onMessage, { description: 'Return payload of Websocket message', icon: 'file' });
    return c;
  } catch (e) {
    console.log('e', e);
  }
};
