/**
 * Created by beuttlerma on 07.02.17.
 */

var self = {};

var logger = require('../global/logger');
var CONFIG = require('../config/config_loader');

var Recipe = require('../model/recipe');
var User = require('../model/user');
var Offer = require('../model/offer');
var Component = require('../model/component');

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
self.getAllRecipesForConfiguration = function (accessToken, configuration, callback) {

    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {
            components: configuration.components
        }
    );

    options.headers.authorization = 'Bearer ' + accessToken;


    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var recipes = [];

        if (jsonData && helper.isArray(jsonData)) {

            jsonData.forEach(function (entry) {
                recipes.push(new Recipe().CreateRecipeFromCoreJSON(entry));
            });
        }

        callback(err, recipes);
    });
};


self.getRecipeForId = function (accessToken, recipeId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId,
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {

        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var recipe;
        if (helper.isObject(jsonData)) {
            recipe = new Recipe().CreateRecipeFromCoreJSON(jsonData);
        }

        callback(err, recipe);
    });
};

self.getComponentsForRecipeId = function (accessToken, recipeId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/components',
        {

        }
    );

    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var components = [];

        if (helper.isArray(jsonData)) {
            jsonData.forEach(function (entry) {
                components.push(new Component().CreateComponentFromJSON(entry));
            });
        }

        callback(err, components);
    });
};

self.getImageForRecipe = function (accessToken, recipeId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/image',
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    options.encoding = null;

    request(options, function (e, r, data) {
        var err = logger.logRequestAndResponse(e, options, r, data);

        callback(err, {
            imageBuffer: data,
            contentType: r ? r.headers['content-type'] : null
        });
    });
};

//</editor-fold>
//<editor-fold desc="Offer">
self.createOfferForRequest = function (accessToken, offerRequest, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/offers',
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

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
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var offer;
        if (!err && helper.isObject(jsonData)) {
            offer = new Offer().CreateFromCoreJSON(jsonData);
        }

        callback(err, offer);
    });
};

self.getOfferForId = function (uuid, accessToken, offerId, callback) {
    // TODO: Retrieve a offer from the market place core
    throw new Error('NOT IMPLEMENTED YET');
};

//</editor-fold>
//<editor-fold desc="User">

self.getAllComponents = function (accessToken, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/components',
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);
        var components = [];

        if (helper.isArray(jsonData)) {
            jsonData.forEach(function (entry) {
                components.push(new Component().CreateComponentFromJSON(entry));
            });
        }

        callback(err, components);
    });
};

//</editor-fold>

self.getLicenseUpdate = function (hsmId, context, accessToken, callback) {
    if (typeof(callback) !== 'function') {
        return logger.info('[marketplace_core_adapter] Callback not registered');
    }

    if (!hsmId || !context) {
        return logger.info('[marketplace_core_adapter] missing function arguments');
    }

    var options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/cmdongle/' + hsmId + '/update',
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    options.body = {
        RAC: context
    };

    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var rau = null;
        var isOutOfDate = false;
        if (jsonData) {
            rau = jsonData['RAU'];
            isOutOfDate = jsonData['isOutOfDate']
        }

        callback(err, rau, isOutOfDate);
    });

};

self.confirmLicenseUpdate = function(hsmId, context, accessToken, callback) {
    if (typeof(callback) !== 'function') {
        return logger.info('[marketplace_core_adapter] Callback not registered');
    }

    if (!hsmId || !context) {
        return logger.info('[marketplace_core_adapter] missing function arguments');
    }

    var options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/cmdongle/' + hsmId + '/update/confirm',
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    options.body = {
        RAC: context
    };

    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var rau = null;
        var isOutOfDate = false;
        if (jsonData) {
            rau = jsonData['RAU'];
            isOutOfDate = jsonData['isOutOfDate']
        }

        callback(err, rau, isOutOfDate);
    });
};

self.createProtocolForClientId = function (accessToken, clientId, protocol, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/protocols/' + clientId,
        {

        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    options.body = protocol;

    request(options, function (e, r, jsonData) {
        var err = logger.logRequestAndResponse(e, options, r, jsonData);
        callback(err, jsonData);
    });
};

module.exports = self;