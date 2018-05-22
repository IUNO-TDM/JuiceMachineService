/**
 * Created by beuttlerma on 07.02.17.
 */
const express = require('express');
const router = express.Router();
const logger = require('../global/logger');
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const helper = require('../services/helper_service');
const protocolsService = require('../services/protocol_service');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/recipe_schema');


router.get('/', validate({
    query: validation_schema.Recipe_Query,
    body: validation_schema.Empty
}), function (req, res, next) {

    protocolsService.writeProtocolForRequest(req);

    logger.debug(req.query);

    const searchConfig = {
        createdAfter: req.query['after'],
        machineType: req.query['machine'],
        components: req.query['components']
    };

    marketplaceCore.getAllRecipesForConfiguration(req.token.accessToken, searchConfig, function (err, recipes) {

        if (err) {
            next(err);
            return;
        }

        recipes = helper.shuffleArray(recipes);

        res.json(recipes);
    });
});

router.get('/:id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.getRecipeForId(req.token.accessToken, req.params['id'], function (err, recipe) {
        if (err) {
            next(err);
            return;
        }

        if (!recipe || !Object.keys(recipe).length) {
            res.sendStatus(404);
            return;
        }

        marketplaceCore.getComponentsForRecipeId(req.token.accessToken, req.params['id'], function (err, components) {
            if (!err && components) {
                recipe.components = components;
            }

            res.json(recipe);
        });
    });
});

router.get('/:id/program', validate({
    query: validation_schema.GetContent_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.getRecipeProgramForId(req.token['accessToken'], req.params['id'], req.query['offerId'], (err, program) => {
        if (err) {
            if (err.statusCode >= 500) {
                return next(err);
            }
            return res.sendStatus(err.statusCode);
        }

        res.json(program);
    });
});

router.get('/:id/image', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.getImageForRecipe(req.token.accessToken, req.params['id'], function (err, data) {
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