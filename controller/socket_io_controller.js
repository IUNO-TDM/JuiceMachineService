/**
 * Created by beuttlerma on 08.02.17.
 *
 * Socket IO Server that provides a WS interface to subscribe on license updates.
 *
 * The client can a join a room, where the hsmId (cmdongleid) is used as room identifier.
 * After joining a certain room, the client gets a 'updateAvailable' event each time a new license update is available
 * for the subscribed hsmId.
 */

const logger = require('../global/logger');
const authentication = require('../services/authentication_service');
const license_service = require('../services/license_service');

function onIOLicenseConnect(socket) {
    logger.debug('Client for License Updates connected.' + socket.id);

    socket.on('room', function(hsmId) {
        logger.debug('Client joining license room: ' + hsmId);
        socket.join(hsmId);
        license_service.registerUpdates(hsmId)
    });
    socket.on('leave', function(hsmId) {
        logger.debug('Client joining license room: ' + hsmId);
        socket.leave(hsmId);
        license_service.unregisterUpdates(hsmId)
    });

    socket.on('disconnect', function () {
        logger.debug('Socket disconnected: ' + socket.id);
    });
}

module.exports = function (io) {
    // Enable bearer token security for websocket server
    io.use(authentication.ws_oAuth);

    var namespace = io.of('/licenses');
    namespace.on('connection', onIOLicenseConnect);
    registerLicenseEvents(namespace);

};

function registerLicenseEvents(namespace){
        license_service.on('updateAvailable', function(offerId,hsmId){
        namespace.to(hsmId).emit('updateAvailable',{hsmId: hsmId, offerId: offerId});
    })
}