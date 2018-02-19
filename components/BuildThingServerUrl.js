
const noflo = require('noflo');

function apiUrl(tenant, username, password, token, base) {
    if (typeof base === 'undefined') {
        base = 'things.apps.bosch-iot-cloud.com';
        //base = 'localhost:8080';
    }

    const url = 'wss://' + tenant +
        '%5c' + username + ':' + password +
        '@' + base + '/ws/1?x-cr-api-token=' + token;
    return url;
}

exports.getComponent = () => {
  console.log('create component BuildThingServerUrl');
  const c = new noflo.Component();
  c.description = 'Parse';
  c.icon = 'file';

  c.inPorts.add('username', { datatype: 'string' });
  c.inPorts.add('password', { datatype: 'string' });
  c.inPorts.add('tenant', { datatype: 'string' });
  c.inPorts.add('token', { datatype: 'string' });

  c.outPorts.add('out', { datatype: 'string' });
  c.outPorts.add('error', { datatype: 'object' });

  c.process((input, output) => {
    const ports = [ 'username', 'password', 'tenant', 'token' ];
    if (!input.hasData.apply(input, ports)) {
      return;
    }
    const [username, password, tenant, token] = input.getData.apply(input, ports);
    const url = apiUrl(tenant, username, password, token);
    output.sendDone({ out: url });
  });

  return c;
};
