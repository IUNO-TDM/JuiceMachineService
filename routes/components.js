/**
 * Created by beuttlerma on 28.03.17.
 */

const express = require('express');
const router = express.Router();
const marketplaceCore = require('../adapter/marketplace_core_adapter');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/component_schema');

router.get('/', validate({
    query: validation_schema.Components_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    const language = req.query['lang'] || 'de';
    marketplaceCore.getAllComponents(language, req.token.accessToken, function (err, components) {

        if (err) {
            next(err);
            return;
        }

        res.json(components);
    });
});

module.exports = router;