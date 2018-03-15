const express = require('express');
const router = express.Router();
const logger = require('../global/logger');
const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validation_schema = require('../schema/protocol_schema');
const validate = validator.validate;
const marketplaceCore = require('../adapter/marketplace_core_adapter')

router.post('/:clientId', validate({
    query: validation_schema.Empty,
    body: validation_schema.Protocol
}), function (req, res, next) {
    let clientId = req.params['clientId'];
    let protocol = req.body;
    console.log("Protocol " + protocol.eventType + " received from " + clientId);
    marketplaceCore.createProtocolForClientId(req.token.accessToken, clientId, protocol, function (err, jsonData) {
        if (err) {
            return next(err);
        }
        if (jsonData) {
            res.status(201);
            res.json(jsonData);
        } else {
            res.sendStatus(201);
        }
    })

});

module.exports = router;