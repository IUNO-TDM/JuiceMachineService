/**
 * Created by beuttlerma on 08.02.17.
 */

var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var marketplaceCore = require('../connectors/dummy_connector');
var helper = require('../services/helper_service');

router.post('/', function (req, res, next) {
    // Validation
    if (!req.body || !helper.isObject(req.body) || !Object.keys(req.body).length) {
        res.status(400).send('No HTTP Body provided');
        return
    }
    var data = req.body;

    logger.debug(data);

    marketplaceCore.getOfferForRequest(data, function(err, offerId) {
        if (err) {
            logger.err(err);

            res.sendStatus(500);

            return;
        }

        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.set('Location', fullUrl + "/" + offerId);
        res.sendStatus(201);
    });



});

module.exports = router;