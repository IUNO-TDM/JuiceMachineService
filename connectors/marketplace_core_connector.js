/**
 * Created by beuttlerma on 07.02.17.
 */

var self = {};

var http = require('https');
var logger = require('../global/logger');
var HOST_SETTINGS = require('../global/constants').HOST_SETTINGS;
var CONFIG = require('../global/constants').CONFIG;

var Recipe = require('../model/recipe');
var User = require('../model/user');
var Offer = require('../model/offer');

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

    //TODO: Parse configuration into query parameters for technology data call
    var options = buildOptionsForRequest(
        'GET',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {
            userUUID: CONFIG.USER_UUID,
            components: configuration.ingredients
        }
    );

    request(options, function (e, r, jsonData) {
        logger.debug('Response:' + JSON.stringify(jsonData));

        if (e) {
            logger.crit(e);
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

        var recipes = [];
        jsonData.forEach(function (entry) {
            recipes.push(new Recipe().CreateRecipeFromCoreJSON(entry));
        });

        if (typeof(callback) == 'function') {

            callback(null, recipes);
        }
    });
};


self.getRecipeForId = function (recipeId, callback) {
    var options = buildOptionsForRequest(
        'GET',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId,
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

    request(options, function (e, r, jsonData) {
        logger.debug('Response:' + jsonData);

        if (e) {
            logger.crit(e);
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

        if (!helper.isObject(jsonData)) {
            callback({
                status: 500,
                message: 'Expected object. But did get something different: ' + jsonData
            });
            return;
        }


        if (typeof(callback) == 'function') {

            callback(null, new Recipe().CreateRecipeFromCoreJSON(jsonData));
        }
    });
};

self.createOfferForRequest = function (offerRequest, callback) {
    var options = buildOptionsForRequest(
        'POST',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/offers',
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

    var items = [];
    offerRequest['items'].forEach(function (entry) {
        items.push({
            dataId: entry.recipeId,
            amount: entry.amount
        });
    });

    options.body = {
        items: items,
        hsmId: offerRequest.hsmId
    };

    request(options, function (e, r, jsonData) {
        logger.debug('Response:' + JSON.stringify(jsonData));

        if (e) {
            logger.crit(e);
            if (typeof(callback) == 'function') {

                callback(e);
            }
        }

        if (r.statusCode != 201) {
            logger.warn('Call not successful');
            var err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn(err);
            callback(err);

            return;
        }

        if (!helper.isObject(jsonData)) {
            callback({
                status: 500,
                message: 'Expected object. But did get something different: ' + jsonData
            });
            return;
        }

        // var offer = new Offer().CreateFromCoreJSON(jsonData);

        if (typeof(callback) == 'function') {

            callback(null, jsonData);
        }
    });
};

self.getOfferForId = function (offerId, callback) {
    // TODO: Retrieve a offer from the market place core
    logger.crit(' -- Function not Implemented --');

    if (typeof(callback) == 'function') {
        callback(null);
    }
};

self.savePaymentForOffer = function (offerId, payment, callback) {
    // TODO: Post a offer to the market place core
    logger.crit(' -- Function not Implemented --');

    if (typeof(callback) == 'function') {
        callback(null);
    }
};

self.getUserForId = function (userId, callback) {

    var options = buildOptionsForRequest(
        'GET',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/users/' + userId,
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

    request(options, function (e, r, jsonData) {
        logger.debug('Response:' + jsonData);

        if (e) {
            logger.crit(e);
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

        if (!helper.isObject(jsonData)) {
            callback({
                status: 500,
                message: 'Expected object. But did get something different: ' + jsonData
            });
            return;
        }


        if (typeof(callback) == 'function') {

            callback(null, new User().CreateFromCoreJSON(jsonData));
        }
    });
};

module.exports = self;