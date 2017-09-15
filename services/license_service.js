/**
 * Created by goergch on 09.03.17.
 */

const EventEmitter = require('events').EventEmitter;
const util = require('util');
var logger = require('../global/logger');
var io = require('socket.io-client');
const config = require('../config/config_loader');

var LicenseService = function () {
    this.registeredRooms = {};
};

const license_service = new LicenseService();
util.inherits(LicenseService, EventEmitter);

license_service.socket = io.connect('http://' + config.HOST_SETTINGS.MARKETPLACE_CORE.HOST
    + ":" + config.HOST_SETTINGS.MARKETPLACE_CORE.PORT + "/licenses", {transports: ['websocket']});
license_service.socket.on('connect', function () {
    logger.debug("connected to license SocketIO at Marketplace");

    // register rooms on reconnect
    Object.keys(license_service.registeredRooms).forEach(function(room) {
        if (!room) {
            return;
        }
        logger.debug('[license_service] Re-Joining room: ' + room);
        license_service.socket.emit('room', room);
    });
});

license_service.socket.on('connect_error', function (error) {
    logger.debug("[license_client] Connection Error: " + error);
});

license_service.socket.on('disconnect', function () {
    logger.debug("disconnected from license SocketIO at Marketplace");
});

license_service.socket.on('updateAvailable', function (data) {
    license_service.emit('updateAvailable', data.offerId, data.hsmId);
});


license_service.registerUpdates = function (hsmId) {
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

module.exports = license_service;