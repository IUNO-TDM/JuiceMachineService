/**
 * Created by beuttlerma on 08.02.17.
 */

var logger = require('../global/logger');
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

    var namespace = io.of('/licenses');
    namespace.on('connection', onIOLicenseConnect);
    registerLicenseEvents(namespace);

};

function registerLicenseEvents(namespace){
        license_service.on('updateAvailable', function(offerId,hsmId){
        namespace.to(hsmId).emit('updateAvailable',{hsmId: hsmId, offerId: offerId});
    })
}