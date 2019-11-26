const mongoClient = require('mongodb').MongoClient;

const koa = require('koa');
const app = new koa();
const router = require('../src/routes/router').router;
const nconf = require('../config/configuration').nconf;

const mongoConnect = () => {
    mongoClient.connect(nconf.get('mongoUrl')).then(client => {
        console.log('connected');
        client.db = nconf.get('dbName');
    }).catch(err => console.log(err));
};

mongoConnect(client => {
    console.log(client);
});


app.use(router.routes()).use(router.allowedMethods());
app.listen(nconf.get('port'), () => console.log(`listening on port ${nconf.get('port')}`));

process.on('uncaughtException', (err) => {
    console.log('unexpectedException ---->' + err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.log('unhandled rejection -------->' + err);
    process.exit(1);
});
