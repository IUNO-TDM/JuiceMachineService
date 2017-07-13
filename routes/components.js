/**
 * Created by beuttlerma on 28.03.17.
 */

var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var marketplaceCore = require('../connectors/marketplace_core_connector');


router.get('/', function (req, res, next) {

    marketplaceCore.getAllComponents(req.query['userUUID'], req.query['accessToken'], function (err, components) {

        if (err) {
            next(err);
            return;
        }

        res.json(components);
    });
});

module.exports = router;