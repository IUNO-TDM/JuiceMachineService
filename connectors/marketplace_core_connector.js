/**
 * Created by beuttlerma on 07.02.17.
 */

var self = {};

self.getAllRecipesForConfiguration = function (configuration, callback) {
    //TODO: Retrieve recipes from the market place core
    if (typeof(callback) == 'function') {

        callback(null, recipes);
    }
};


self.getRecipeForId = function (recipeId, callback) {
    //TODO: Retrieve single recipe from market place core

    if (typeof(callback) == 'function') {
        callback(null, recipeStorage[recipeId]);
    }
};

self.createOfferForRequest = function(request, callback) {
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