/**
 * Created by beuttlerma on 02.06.17.
 */


var logger = require('../global/logger');
const CONFIG = require('../config/config_loader');
var request = require('request');

var self = {};

function buildOptionsForRequest(method, protocol, host, port, path, qs) {

    return {
        method: method,
        url: protocol + '://' + host + ':' + port + path,
        qs: qs,
        json: true,
        headers: {
            'Authorization': 'Basic ' + new Buffer(CONFIG.OAUTH_CREDENTIALS.CLIENT_ID + ':' + CONFIG.OAUTH_CREDENTIALS.CLIENT_SECRET).toString('base64')
        }
    }
}

self.validateToken = function (userUUID, token, callback) {
    var tokenValid = false;

    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not regis§tered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER.PORT,
        '/tokeninfo',
        {
            access_token: token
        }
    );

    request(options, function (e, r, tokenInfo) {
        var err = logger.logRequestAndResponse(e, options, r, tokenInfo);

        if (err) {
            return callback(err);
        }

        tokenValid = tokenInfo.user.id === userUUID;
        tokenValid = tokenValid && new Date(tokenInfo.accessTokenExpiresAt) > new Date();

        callback(err, tokenValid)
    });


};

self.getUserForId = function (uuid, accessToken, userId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER.PORT,
        '/users/' + userId,
        {

        }
    );

    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var user;

        if (helper.isObject(jsonData)) {
            user = new User().CreateFromCoreJSON(jsonData);
        }


        if (typeof(callback) === 'function') {

            callback(err, user);
        }
    });
};

self.getImageForUser = function (uuid, accessToken, userId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER.PORT,
        '/users/' + userId + '/image',
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    options.encoding = null;

    request(options, function (e, r, imageBuffer) {
        var err = logger.logRequestAndResponse(e, options, r, imageBuffer);

        callback(err, {
            imageBuffer: imageBuffer,
            contentType: r ? r.headers['content-type'] : null
        });
    });
};

module.exports = self;