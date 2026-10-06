const mongoose = require('mongoose');

const clientOptions = {
    dbName : 'apinode'
};

// Connexion Mongo (IMPORTANT !)
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}