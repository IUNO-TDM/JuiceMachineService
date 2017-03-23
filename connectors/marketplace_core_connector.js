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

//<editor-fold desc="Recipes">
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

        if (r && r.statusCode != 200) {
            var err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn('Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        if (!helper.isArray(jsonData)) {
            callback({
                status: 500,
                message: 'Error while retrieving a list of recipes from the market place core. Expected an json array but got something different: ' + jsonData
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
        logger.debug('Response:' + JSON.stringify(jsonData));

        if (e) {
            logger.crit(e);
            if (typeof(callback) == 'function') {

                callback(e);
            }
        }

        if (r && r.statusCode != 200) {
            var err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn('Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        if (!helper.isObject(jsonData)) {
            callback({
                status: 500,
                message: 'Error while retrieving a single recipe from the market place core. Expected a single object but got something different: ' + jsonData
            });
            return;
        }


        if (typeof(callback) == 'function') {

            callback(null, new Recipe().CreateRecipeFromCoreJSON(jsonData));
        }
    });
};

self.getImageForRecipe = function (recipeId, callback) {
    var options = buildOptionsForRequest(
        'GET',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/image',
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

    options.encoding = null;

    request(options, function (e, r, data) {
        if (e) {
            logger.crit(e);
            if (typeof(callback) == 'function') {

                callback(e);
            }
        }

        if (r && r.statusCode != 200) {
            var err = {
                status: r.statusCode,
                message: r.statusMessage
            };
            logger.warn('Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        if (typeof(callback) == 'function') {

            callback(null, {
                imageBuffer: data,
                contentType: r.headers['content-type']
            });
        }
    });
};

//</editor-fold>
//<editor-fold desc="Offer">
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

        if (r && r.statusCode != 201) {
            var err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn('Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        if (!helper.isObject(jsonData)) {
            callback({
                status: 500,
                message: 'Error while requesting a offer on the market place core. Expected an JSON Object but got something different: ' + jsonData
            });
            return;
        }

        var offer = new Offer().CreateFromCoreJSON(jsonData);

        if (typeof(callback) == 'function') {

            callback(null, offer);
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

//</editor-fold>
//<editor-fold desc="User">

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
        logger.debug('Response:' + JSON.stringify(jsonData));

        if (e) {
            logger.crit(e);
            if (typeof(callback) == 'function') {

                callback(e);
            }
        }

        if (r && r.statusCode != 200) {
            var err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn('Call not successful for options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        if (!helper.isObject(jsonData)) {
            callback({
                status: 500,
                message: 'Error while retrieving a single user from the market place core. Expected a JSON object but got something different: ' + jsonData
            });
            return;
        }


        if (typeof(callback) == 'function') {

            callback(null, new User().CreateFromCoreJSON(jsonData));
        }
    });
};

self.getImageForUser = function (userId, callback) {
    var options = buildOptionsForRequest(
        'GET',
        'http',
        HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/users/' + userId + '/image',
        {
            'userUUID': CONFIG.USER_UUID
        }
    );
    options.encoding = null;

    request(options, function (e, r, imageBuffer) {
        if (e) {
            logger.crit(e);
            if (typeof(callback) == 'function') {

                callback(e);
            }
        }

        if (r && r.statusCode != 200) {
            var err = {
                status: r.statusCode,
                message: r.statusMessage
            };
            logger.warn('Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        if (typeof(callback) == 'function') {

            callback(null, {
                imageBuffer: imageBuffer,
                contentType: r.headers['content-type']
            });
        }
    });
};

//</editor-fold>
module.exports = self;