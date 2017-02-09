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
        res.status(400).send('Missing request object in http body.');
        return
    }
    var data = req.body;

    logger.debug(data);

    marketplaceCore.createOfferForRequest(data, function(err, offer) {
        if (err) {
            logger.err(err);

            res.sendStatus(500);

            return;
        }

        res.json(offer);
    });
});

router.get('/:id', function (req, res, next) {
    logger.log(req);
    marketplaceCore.getOfferForId(req.params['id'], function(err, offer) {
        if(err) {
            logger.err(err);

            res.sendStatus(500);
            return;
        }

        if (!offer || !Object.keys(offer).length) {
            res.sendStatus(404);
            return;
        }

        res.json(offer);
    });

});

router.post('/:id/payment', function (req, res, next) {
    // Validation
    if (!req.body || !helper.isObject(req.body) || !Object.keys(req.body).length) {
        res.status(400).send('Missing payment object in http body.');
        return
    }
    var data = req.body;

    logger.debug(data);

    marketplaceCore.savePaymentForOffer(req.params['id'], data, function(err, offer) {
        if (err) {
            logger.err(err);

            if (err.status) {
                res.status(404).send(err.msg);

                return;
            }


            res.sendStatus(500);
            return;
        }

        res.json(offer);
    });
});

module.exports = router;