/**
 * Created by beuttlerma on 07.02.17.
 */

var self = {};

var http = require('https');
var logger = require('../global/logger');
var HOST_SETTINGS = require('../global/constants').HOST_SETTINGS;
var Recipe = require('../model/recipe');
var helper = require('../services/helper_service');
var request = require('request');

function buildOptionsForRequest(method, protocol, host, port, path, qs) {

    return {
        method: method,
        url: protocol + '://' + host + ':' + port + path,
        qs: qs,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

self.getAllRecipesForConfiguration = function (configuration, callback) {
    var options = buildOptionsForRequest(
        'GET',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {
            'userUUID' :  '12345',
            'ingredients': configuration
        }
    );

    request(options, function (e, r, jsonData) {
        logger.debug('Response:' + jsonData);

        if (e) {
            console.error(e);
            if (typeof(callback) == 'function') {

                callback(e);
            }
        }

        if (r.statusCode != 200) {
            logger.warn('Call not successful');
            var err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn(err);
            callback(err);

            return;
        }

        if (!helper.isArray(jsonData)) {
            callback({
                status: 500,
                message: 'Expected array. But did get something different: ' + jsonData
            });
            return;
        }

        //TODO: Parse json data into objects to validate the content
        if (typeof(callback) == 'function') {

            callback(null, jsonData);
        }
    });
};


self.getRecipeForId = function (recipeId, callback) {
    //TODO: Retrieve single recipe from market place core

    if (typeof(callback) == 'function') {
        callback(null, recipeStorage[recipeId]);
    }
};

self.createOfferForRequest = function (request, callback) {
    //TODO: Pass the request to the market place core.

    if (typeof (callback) == 'function') {
        callback(null, offerId);
    }
};

self.getOfferForId = function (offerId, callback) {
    // TODO: Retrieve a offer from the market place core

    if (typeof(callback) == 'function') {
        callback(null);
    }
};

self.savePaymentForOffer = function (offerId, payment, callback) {
    // TODO: Post a offer to the market place core

    if (typeof(callback) == 'function') {
        callback(null);
    }
};

self.getUserForId = function (userId, callback) {
    // TODO: Retrieve user from market place core.

    if (typeof(callback) == 'function') {
        callback(null);
    }
};

module.exports = self;