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
var ProtocolService = function () {
    const self = this;
}

const protocol_service = new ProtocolService();


protocol_service.createProtocolForClientId = function(clientId,protocol, callback){
    authServer.getClientAccessToken(function(err, token){
        if(err){
            console.error("Error when creating protocol at MarketplaceCore: " + err);
            callback(err, null);
        }else{
            marketplaceCore.createProtocolForClientId(token.accessToken,clientId,protocol,function(err,jsondata){
                callback(err,jsondata);
            })
        }
    })
}

module.exports = protocol_service;