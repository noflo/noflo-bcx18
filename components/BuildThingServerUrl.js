const noflo = require('noflo');

function apiUrl(tenant, username, password, token, base='things.apps.bosch-iot-cloud.com') {
  const url = `wss://${tenant}%5c${username}:${password}@${base}/ws/1?x-cr-api-token=${token}`;
  return url;
}

exports.getComponent = () => noflo.asComponent(apiUrl, {
  icon: 'file',
  description: 'Create url with autorization',
});
