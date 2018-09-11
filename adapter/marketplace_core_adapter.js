/**
 * Created by beuttlerma on 07.02.17.
 */

const self = {};

const logger = require('../global/logger');
const CONFIG = require('../config/config_loader');

const Recipe = require('../model/recipe');
const Offer = require('../model/offer');
const Component = require('../model/component');

const helper = require('../services/helper_service');

const request = require('request');


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
self.getAllRecipesForConfiguration = function (language, accessToken, configuration, callback) {

    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {
            components: configuration.components,
            lang: language,
            technology: CONFIG.TECHNOLOGY_UUID
        }
    );

    options.headers.authorization = 'Bearer ' + accessToken;


    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        const recipes = [];

        if (jsonData && helper.isArray(jsonData)) {

            jsonData.forEach(function (entry) {
                recipes.push(Recipe.CreateRecipeFromCoreJSON(entry));
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

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId,
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {

        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        let recipe;
        if (helper.isObject(jsonData)) {
            recipe = Recipe.CreateRecipeFromCoreJSON(jsonData);
        }

        callback(err, recipe);
    });
};

self.getRecipeProgramForId = function (accessToken, recipeId, offerId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        `/technologydata/${recipeId}/content`,
        {
            offerId: offerId
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, program) {

        const err = logger.logRequestAndResponse(e, options, r, program);

        callback(err, program);
    });
};


self.getComponentsForRecipeId = function (accessToken, recipeId, lang, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/components',
        {
            lang: lang,
            technology: CONFIG.TECHNOLOGY_UUID
        }
    );

    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        const components = [];

        if (helper.isArray(jsonData)) {
            jsonData.forEach(function (entry) {
                components.push(Component.CreateComponentFromJSON(entry));
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

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeId + '/image',
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    options.encoding = null;

    request(options, function (e, r, data) {
        const err = logger.logRequestAndResponse(e, options, r, data);

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

    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/offers',
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    const items = [];
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
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        let offer;
        if (!err && helper.isObject(jsonData)) {
            offer = Offer.CreateFromCoreJSON(jsonData);
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

self.getAllComponents = function (language, accessToken, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/components',
        {
            lang: language,
            technologies: [CONFIG.TECHNOLOGY_UUID]
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);
        const components = [];

        if (helper.isArray(jsonData)) {
            jsonData.forEach(function (entry) {
                components.push(Component.CreateComponentFromJSON(entry));
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

    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/cmdongle/' + hsmId + '/update',
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    options.body = {
        RAC: context
    };

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        let rau = null;
        let isOutOfDate = false;
        if (jsonData) {
            rau = jsonData['RAU'];
            isOutOfDate = jsonData['isOutOfDate']
        }

        callback(err, rau, isOutOfDate);
    });

};

self.confirmLicenseUpdate = function (hsmId, context, accessToken, callback) {
    if (typeof(callback) !== 'function') {
        return logger.info('[marketplace_core_adapter] Callback not registered');
    }

    if (!hsmId || !context) {
        return logger.info('[marketplace_core_adapter] missing function arguments');
    }

    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/cmdongle/' + hsmId + '/update/confirm',
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    options.body = {
        RAC: context
    };

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        let rau = null;
        let isOutOfDate = false;
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

    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/protocols/' + clientId,
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    options.body = protocol;

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);
        callback(err, jsonData);
    });
};

self.requestForLicenseUpdate = function (accessToken, offerId, hsmId, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        `/offers/${offerId}/request_license_update`,
        {}
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    options.body = {
        hsmId: hsmId
    };

    request(options, (e, r, jsonData) => {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);
        callback(err);
    });
};

module.exports = self;