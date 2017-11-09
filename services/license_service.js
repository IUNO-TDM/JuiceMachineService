/**
 * Created by goergch on 09.03.17.
 *
 * This is a websocket client that registers on rooms on the marketplace core.
 *
 */

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const logger = require('../global/logger');
const io = require('socket.io-client');
const config = require('../config/config_loader');
const authServer = require('../adapter/auth_service_adapter');

var LicenseService = function () {
    this.registeredRooms = {};
};

const license_service = new LicenseService();
util.inherits(LicenseService, EventEmitter);


authServer.getClientAccessToken(function (err, token) {
    license_service.socket = io.connect('http://' + config.HOST_SETTINGS.MARKETPLACE_CORE.HOST
        + ":" + config.HOST_SETTINGS.MARKETPLACE_CORE.PORT + "/licenses", {
        transports: ['websocket'],
        extraHeaders: {
            Authorization: 'Bearer ' + (token ? token.accessToken : '')
        }
    });

    license_service.socket.on('connect', function () {
        logger.debug("connected to license SocketIO at Marketplace");

        // register rooms on reconnect
        Object.keys(license_service.registeredRooms).forEach(function (room) {
            if (!room) {
                return;
            }
            logger.debug('[license_service] Re-Joining room: ' + room);
            license_service.socket.emit('room', room);
        });
    });

    license_service.socket.on('connect_error', function (error) {
        logger.debug("[license_client] Connection Error: " + error);
        authServer.invalidateToken();
    });

    license_service.socket.on('disconnect', function () {
        logger.debug("disconnected from license SocketIO at Marketplace");
    });

    /**
     * updateAvailable events are directly passed to the registered clients. Via the license service.
     */
    license_service.socket.on('updateAvailable', function (data) {
        license_service.emit('updateAvailable', data.offerId, data.hsmId);
    });


    license_service.registerUpdates = function (hsmId) {
        /**
         * The subscriptions for license updates are separated by the hsmId.
         */
        if (!hsmId) {
            return;
        }

        license_service.registeredRooms[hsmId] = true;

        license_service.socket.emit('room', hsmId);
    };

    license_service.unregisterUpdates = function (hsmId) {
        if (license_service.registeredRooms[hsmId]) {
            delete  license_service.registeredRooms[hsmId];
        }

        license_service.socket.emit('leave', hsmId);
    };
});

module.exports = license_service;