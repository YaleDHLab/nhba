const request = require('superagent');

const config = {};

/** *
 * Static
 ** */

config.api = {
  protocol: 'https',
  host: 'nhba.yale.edu',
  port: 8081,
  prefix: 'api'
};

config.endpoint = '';
config.endpoint += `${config.api.protocol}://`;
config.endpoint += `${config.api.host}:`;
config.endpoint += `${config.api.port}/`;
config.endpoint += `${config.api.prefix}/`;

/** *
 * Namespace
 ** */

config.db = 'nhba';
config.brand = 'nhba';

/** *
 * Methods
 ** */

config.get = function getConfig(route, callback) {
  request
    .get(config.endpoint + route)
    .set('Accept', 'application/json')
    .end(callback);
};

/** *
 * Certificates
 ** */

config.ssl = {
  // key: 'tls/privkey.pem',
  // cert: 'tls/fullchain.pem'
  key: '/etc/letsencrypt/live/nhba.yale.edu/privkey.pem',
  cert: '/etc/letsencrypt/live/nhba.yale.edu/fullchain.pem'
};

module.exports = config;
