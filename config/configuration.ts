import * as nconfig from 'nconf';
import * as path from 'path';

const configPath = path.join(__dirname, '/config.json');
nconfig.file(configPath);

export const nconf = nconfig;
