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
const protocol_service = require('../services/protocol_service');
var clientDict = {};


function onIOLicenseConnect(socket) {
    logger.debug('Client for License Updates connected.' + socket.id);

    socket.on('room', function (hsmId) {
        logger.debug('Client joining license room: ' + hsmId);
        socket.join(hsmId);
        license_service.registerUpdates(hsmId)
    });
    socket.on('leave', function (hsmId) {
        logger.debug('Client joining license room: ' + hsmId);
        socket.leave(hsmId);
        license_service.unregisterUpdates(hsmId)
    });

    socket.on('clientId', function (clientId) {
        clientDict[socket.id] = clientId;
        const protocol = {
            eventType: 'connection',
            timestamp: new Date().toISOString(),
            payload: {
                connected: true
            }
        };
        protocol_service.createProtocolForClientId(clientId, protocol, function (err, jsondata) {
            //do nothing...
        })
    });

    socket.on('disconnect', function () {
        logger.debug('Socket disconnected: ' + socket.id);
        if (clientDict[socket.id]) {
            //tell this the marketplace core via protocols route
            const clientId = clientDict[socket.id]
            delete clientDict[socket.id];
            const protocol = {
                eventType: 'connection',
                timestamp: new Date().toISOString(),
                payload: {
                    connected: false
                }
            };
            protocol_service.createProtocolForClientId(clientId, protocol, function (err, jsondata) {
                //do nothing...
            })
        }
    });
}

module.exports = function (io) {
    var namespace = io.of('/licenses');

    // Enable bearer token security for websocket server
    namespace.use(authentication.ws_oAuth);
    namespace.on('connection', onIOLicenseConnect);
    registerLicenseEvents(namespace);

};

function registerLicenseEvents(namespace) {
    license_service.on('updateAvailable', function (offerId, hsmId) {
        namespace.to(hsmId).emit('updateAvailable', {hsmId: hsmId, offerId: offerId});
    })
}