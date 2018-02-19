
const noflo = require('noflo');

function onMessage(data) {
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
  const c = new noflo.Component();
  c.description = 'Parse';
  c.icon = 'file';
  c.inPorts.add('in', {
    datatype: 'object'
  });
  c.outPorts.add('out', {
    datatype: 'object'
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  c.process((input, output) => {
    if (!input.hasData('in')) {
      return;
    }

    const payload = onMessage(input.getData('in'));
    output.sendDone({ out: payload });
  });

  return c;
};
