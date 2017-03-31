/**
 * Created by beuttlerma on 07.02.17.
 */
var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var marketplaceCore = require('../connectors/marketplace_core_connector');
var validate = require('express-jsonschema').validate;


router.get('/', validate({query: require('../schema/recipe_query_schema')}), function (req, res, next) {

    logger.debug(req.query);

    var searchConfig = {
        createdAfter: req.query['after'],
        machineType: req.query['machine'],
        ingredients: req.query['ingredients']
    };

    marketplaceCore.getAllRecipesForConfiguration(searchConfig, function (err, recipes) {

        if (err) {
            next(err);
            return;
        }

        res.json(recipes);
    });
});

router.get('/:id', function (req, res, next) {
    marketplaceCore.getRecipeForId(req.params['id'], function (err, recipe) {
        if (err) {
            next(err);
            return;
        }

        if (!recipe || !Object.keys(recipe).length) {
            res.sendStatus(404);
            return;
        }

        marketplaceCore.getComponentsForRecipeId(req.params['id'], function (err, components) {
            if (!err && components) {
                recipe.components = components;
            }

            res.json(recipe);
        });
    });
});

router.get('/:id/image', function (req, res, next) {
    marketplaceCore.getImageForRecipe(req.params['id'], function (err, data) {
        if (err) {
            next(err);
            return;
        }

        if (!data) {
            res.sendStatus(404);
            return;
        }

        res.set('Content-Type', data.contentType);
        res.send(data.imageBuffer);
    });
});

module.exports = router;