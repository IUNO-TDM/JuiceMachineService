/**
 * Created by goergch on 15.03.18.
 *
 * A service for creating protocol entries at marketplacecore. handles the authentication
 *
 */
const logger = require('../global/logger');
const config = require('../config/config_loader');
const authServer = require('../adapter/auth_service_adapter');
const marketplaceCore = require('../adapter/marketplace_core_adapter');

const Protocol = require('../model/protocol');


const self = {};

self.createProtocolForClientId = function (clientId, protocol) {
    authServer.getClientAccessToken(function (err, token) {
        if (err) {
            return logger.warn('[protocol_service] could not create protocol. Error when requesting access token')
        } else {
            marketplaceCore.createProtocolForClientId(token['accessToken'], clientId, protocol, function (err, jsondata) {
                if (err) {
                    return logger.warn('[protocols_service] could not create protocol');
                }
            })
        }
    })
};

self.writeProtocolForRequest = function (req) {

    const protocol = new Protocol(
        req.baseUrl,
        new Date().toISOString(),
        {
            method: req.method,
            query: req.query,
            params: req.params,
            client: req.token.client
        });

    self.createProtocolForClientId(config.OAUTH_CREDENTIALS.CLIENT_ID, protocol);
};

module.exports = self;