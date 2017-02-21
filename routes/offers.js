/**
 * Created by beuttlerma on 08.02.17.
 */

var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var marketplaceCore = require('../connectors/dummy_connector');
var helper = require('../services/helper_service');
var validate = require('express-jsonschema').validate;


router.post('/', validate({body: require('../schema/offer_request_schema')}), function (req, res, next) {
    var data = req.body;

    logger.debug(data);

    marketplaceCore.createOfferForRequest(data, function (err, offer) {
        if (err) {
            next(err);
            return;
        }

        res.json(offer);
    });
});

router.get('/:id', function (req, res, next) {

    marketplaceCore.getOfferForId(req.params['id'], function (err, offer) {
        if (err) {
            next(err);
            return;
        }

        if (!offer || !Object.keys(offer).length) {
            res.sendStatus(404);
            return;
        }

        res.json(offer);
    });

});

router.post('/:id/payment', validate({body: require('../schema/payment_schema')}) ,function (req, res, next) {
    var data = req.body;

    logger.debug(data);

    marketplaceCore.savePaymentForOffer(req.params['id'], data, function (err, offer) {
        if (err) {
            next(err);

            return;
        }

        res.json(offer);
    });
});

module.exports = router;