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
self.getAllRecipesForConfiguration = function (configuration, callback) {

    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {
            userUUID: CONFIG.USER_UUID,
            components: configuration.ingredients
        }
    );

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


self.getRecipeForId = function (recipeId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId,
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

    request(options, function (e, r, jsonData) {

        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var recipe;
        if (helper.isObject(jsonData)) {
            recipe = new Recipe().CreateRecipeFromCoreJSON(jsonData);
        }

        callback(err, recipe);
    });
};

self.getComponentsForRecipeId = function (recipeId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/components',
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

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

self.getImageForRecipe = function (recipeId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/image',
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

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
self.createOfferForRequest = function (offerRequest, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'POST',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
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
        var err = logger.logRequestAndResponse(e, options, r, jsonData);

        var offer;
        if (helper.isObject(jsonData)) {
            offer = new Offer().CreateFromCoreJSON(jsonData);
        }

        callback(err, offer);
    });
};

self.getOfferForId = function (offerId, callback) {
    // TODO: Retrieve a offer from the market place core
    throw new Error('NOT IMPLEMENTED YET');
};

//</editor-fold>
//<editor-fold desc="User">

self.getUserForId = function (userId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/users/' + userId,
        {
            'userUUID': CONFIG.USER_UUID
        }
    );

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

self.getImageForUser = function (userId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/users/' + userId + '/image',
        {
            'userUUID': CONFIG.USER_UUID
        }
    );
    options.encoding = null;

    request(options, function (e, r, imageBuffer) {
        var err = logger.logRequestAndResponse(e, options, r, imageBuffer);

        callback(err, {
            imageBuffer: imageBuffer,
            contentType: r ? r.headers['content-type'] : null
        });
    });
};

self.getAllComponents = function (callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        'http',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/components',
        {
            userUUID: CONFIG.USER_UUID
        }
    );

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
module.exports = self;