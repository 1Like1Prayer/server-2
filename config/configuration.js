const path = require('path');
nconf = require('nconf');

const configPath = path.join(__dirname, '/config.json');
nconf.file(configPath);

exports.nconf = nconf;
