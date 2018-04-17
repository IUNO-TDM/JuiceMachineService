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
    const self = this;
    this.registeredRooms = {};
    this.refreshTokenAndReconnect = function () {
        authServer.invalidateToken();
        authServer.getClientAccessToken(function (err, token) {
            if (err) {
                logger.warn(err);
            }
            if (self.socket) {
                self.socket.io.opts.extraHeaders = {
                    Authorization: 'Bearer ' + (token ? token.accessToken : '')
                };
                self.socket.io.disconnect();
                self.socket.connect();
            }
        });
    };
};

const license_service = new LicenseService();
util.inherits(LicenseService, EventEmitter);

license_service.socket = io.connect('http://' + config.HOST_SETTINGS.MARKETPLACE_CORE.HOST
    + ":" + config.HOST_SETTINGS.MARKETPLACE_CORE.PORT + "/licenses", {
    transports: ['websocket'],
    extraHeaders: {},
    autoConnect: false
});

license_service.socket.on('connect', function () {
    logger.info("[license_service] connected to license SocketIO at Marketplace");

    // register rooms on reconnect
    Object.keys(license_service.registeredRooms).forEach(function (room) {
        if (!room) {
            return;
        }
        logger.debug('[license_service] Re-Joining room: ' + room);
        license_service.socket.emit('room', room);
    });
});

license_service.socket.on('error', function (error) {
    logger.debug("[license_service] Error: " + error);

    license_service.refreshTokenAndReconnect();
});

license_service.socket.on('connect_failed', function (error) {
    logger.debug("[license_service] Connection Failed: " + error);
});

license_service.socket.on('connect_error', function (error) {
    logger.warn("[license_service] Connection Error: " + error);
});

license_service.socket.on('reconnect_error', function (error) {
    logger.debug("[license_service] Re-Connection Error: " + error);
});

license_service.socket.on('reconnect_attempt', function (number) {
    logger.debug("[license_service] Re-Connection attempt: " + number);
});

license_service.socket.on('disconnect', function () {
    logger.info("[license_service] disconnected from license SocketIO at Marketplace");
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

license_service.socket.open();

module.exports = license_service;