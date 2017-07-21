/**
 * Created by beuttlerma on 21.02.17.
 */

var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var oAuthServer = require('../adapter/auth_service_adapter');
var helper = require('../services/helper_service');
var validate = require('express-jsonschema').validate;

router.get('/:id', function (req, res, next) {

    oAuthServer.getUserForId(req.params['id'], req.token.accessToken, function (err, user) {
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

    oAuthServer.getImageForUser(req.params['id'], req.token.accessToken, function (err, data) {
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