/**
 * Created by beuttlerma on 18.04.17.
 */


var self = {};


// ---- CONFIGURATION EXPORT ----

self.LOG_LEVEL = 'debug';
self.HOST_SETTINGS = {
    MARKETPLACE_CORE: {
        PROTOCOL: 'http',
        HOST: 'localhost',
        PORT: 3002
    },
    OAUTH_SERVER: {
        PROTOCOL: 'http',
        HOST: 'localhost',
        PORT: 3006
    }
};
self.OAUTH_CREDENTIALS = {
    CLIENT_ID: '',
    CLIENT_SECRET: ''
};

self.TECHNOLOGY_UUID = 'da17a8fc-a5b3-40a4-b6a5-276667db027a';


module.exports = self;