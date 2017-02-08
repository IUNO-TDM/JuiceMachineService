/**
 * Created by beuttlerma on 07.02.17.
 */
var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var marketplaceCore = require('../connectors/dummy_connector');


router.get('/', function (req, res, next) {

    logger.debug(req.query);

    var searchConfig = {
        createdAfter: req.query['after'],
        machineType: req.query['machine'],
        ingredients: req.query['ingredients']
    };

    marketplaceCore.getAllRecipesForConfiguration(searchConfig, function (err, recipes) {

        if (err) {
            logger.err(err);

            res.sendStatus(500);
        } else {
            res.json(recipes);
        }
    });
});

router.get('/:id', function (req, res, next) {
    logger.log(req);
    marketplaceCore.getRecipeForId(req.params['id'], function(err, recipe) {
        if(err) {
            logger.err(err);

            res.sendStatus(500);
            return;
        }

        if (!recipe || !Object.keys(recipe).length) {
            res.sendStatus(404);
            return;
        }

        res.json(recipe);
    });

});

module.exports = router;