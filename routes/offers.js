/**
 * Created by beuttlerma on 08.02.17.
 */

const express = require('express');
const router = express.Router();
const logger = require('../global/logger');
const marketplaceCore = require('../adapter/marketplace_core_adapter');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/offer_schema');


router.post('/', validate({
    body: validation_schema.OfferRequest_Body,
    query: validation_schema.Empty
}), function (req, res, next) {
    const data = req.body;

    logger.debug(data);

    marketplaceCore.createOfferForRequest(req.token.accessToken, data, function (err, offer) {
        if (err) {
            return next(err);
        }

        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.set('Location', fullUrl + '/' + offer.id);
        res.status(201);
        res.json(offer);
    });
});

router.get('/:id', validate({
    body: validation_schema.Empty,
    query: validation_schema.Empty
}), function (req, res, next) {

    marketplaceCore.getOfferForId(req.token.user.id, req.token.accessToken, req.params['id'], function (err, offer) {
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

router.post('/:offer_id/request_license_update', validate({
    body: validation_schema.RequestLicenseUpdateBody,
    query: validation_schema.Empty
}), function (req, res, next) {

    marketplaceCore.requestForLicenseUpdate(req.token.accessToken, req.params['offer_id'], req.body['hsmId'], (err) => {
        if (err) {
            next(err);
            return;
        }

        res.sendStatus(200);
    });

});

module.exports = router;