const mongoose = require('mongoose');
const nconf = require('../config/configuration').nconf;


exports.mongoConnect = (callback) => {
    mongoose.connect(nconf.get('mongoUrl'), {useNewUrlParser: true})
        .then(() => {
            console.log('connected successfully to db');
            callback();
        })
        .catch(err => console.log(`error----> ${err}`))
};
