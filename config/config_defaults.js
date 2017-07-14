/**
 * Created by beuttlerma on 18.04.17.
 */


var self = {
};



// ---- CONFIGURATION EXPORT ----

self.LOG_LEVEL = 'debug';
self.HOST_SETTINGS = {
    MARKETPLACE_CORE: {
        HOST: 'localhost',
        PORT: 3002
    },
    OAUTH_SERVER: {
        HOST: 'localhost',
        PORT: 3006
    }
};
self.OAUTH_CREDENTIALS = {
    CLIENT_ID: '',
    CLIENT_SECRET: ''
};



module.exports = self;