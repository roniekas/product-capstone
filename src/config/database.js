const config = require('./config');

module.exports = {
    development: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        port: config.dbPort,
        dialect: 'mysql',
        timezone: '+07:00',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    test: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        timezone: '+07:00',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    production: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        port: config.port,
        dialect: 'mysql',
        timezone: '+07:00',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
};
