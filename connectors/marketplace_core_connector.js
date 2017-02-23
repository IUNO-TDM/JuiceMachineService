/**
 * Created by beuttlerma on 07.02.17.
 */

var self = {};

var http = require('https');
var logger = require('../global/logger');
var HOST_SETTINGS = require('../global/constants').HOST_SETTINGS;
var Recipe = require('../model/recipe');
var helper = require('../services/helper_service');

self.getAllRecipesForConfiguration = function (configuration, callback) {
    //TODO: Retrieve recipes from the market place core

    var options = {
        method: 'GET',
        host: HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        path: 'techdata',
        port: HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    http.get(options, function (res) {
        logger.debug("Response: " + res.statusCode);

        //parse the json body
        var data = '';
        res.setEncoding('utf8');
        res.on("data", function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var jsonData = [];

            try {
                jsonData = JSON.parse(data);

                if (!helper.isArray(jsonData)) {
                    callback({
                        message: 'Expected array from marketplace core. But did get something different.'
                    });
                    return;
                }

                var recipeList = [];

                jsonData.forEach(function(element) {
                    var recipe = new Recipe().CreateRecipeFromCoreJSON(element);
                    if (recipe) {
                        recipeList.add(recipe);
                    }
                });

                if (typeof(callback) == 'function') {

                    callback(null, recipeList);
                }
            }
            catch (ex) {
                logger.err(ex);
                logger.err(data);
                callback(ex);
            }



        });
    }).on('error', function (e) {
        logger.err(e);
        if (typeof(callback) == 'function') {

            callback(e);
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