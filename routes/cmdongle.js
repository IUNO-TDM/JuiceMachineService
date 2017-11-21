const express = require('express');
const router = express.Router();
const validate = require('express-jsonschema').validate;
const marketplaceCore = require('../adapter/marketplace_core_adapter');

router.post('/:hsmId/update', validate({
    query: require('../schema/cmdongle_schema').LicenseUpdate_Query,
    body: require('../schema/cmdongle_schema').LicenseUpdate_Body
}), function (req, res, next) {


    const hsmId = req.params['hsmId'];
    const racBuffer = req.body.RAC;

    marketplaceCore.getLicenseUpdate(hsmId, racBuffer, req.token.accessToken, function (err, rauBuffer, isOutOfDate) {
        if (err) {
            return next(err);
        }

        res.json({
            RAU: rauBuffer,
            isOutOfDate: isOutOfDate
        });
    });

});

router.post('/:hsmId/update/confirm', validate({
    query: require('../schema/cmdongle_schema').LicenseUpdate_Query,
    body: require('../schema/cmdongle_schema').LicenseUpdate_Body
}), function (req, res, next) {


    const hsmId = req.params['hsmId'];
    const racBuffer = req.body.RAC;

    marketplaceCore.confirmLicenseUpdate(hsmId, racBuffer, req.token.accessToken, function (err) {
        if (err) {
            return next(err);
        }

        res.sendStatus(200);
    });

});

module.exports = router;