/**
 * Created by beuttlerma on 11.07.17.
 */

var authService= require('../connectors/auth_service_connector');
var self = {};

function unauthorized(res) {
    res.set('WWW-Authenticate', 'Bearer realm=Access Token Required"');
    return res.sendStatus(401);
}


self.oAuth = function(req, res, next) {
    authService.validateToken(req.query['userUUID'], req.query['accessToken'], function(err, isValid){
        if (isValid) {
            next();
        }
        else {
            return unauthorized(res);
        }
    })
};

module.exports = self;