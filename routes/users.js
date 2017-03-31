/**
 * Created by beuttlerma on 21.02.17.
 */

var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var marketplaceCore = require('../connectors/marketplace_core_connector');
var helper = require('../services/helper_service');
var validate = require('express-jsonschema').validate;

router.get('/:id', function (req, res, next) {

    marketplaceCore.getUserForId(req.params['id'], function (err, user) {
        if (err) {
            next(err);
            return;
        }

        if (!user || !Object.keys(user).length) {
            res.sendStatus(404);
            return;
        }

        res.json(user);
    });

});

router.get('/:id/image', function (req, res, next) {

    marketplaceCore.getImageForUser(req.params['id'], function (err, data) {
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