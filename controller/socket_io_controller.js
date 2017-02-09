/**
 * Created by beuttlerma on 08.02.17.
 */

var logger = require('../global/logger');

function onIOConnect(socket) {
    logger.debug('Client for Offer connected.' + socket.id);

    socket.on('room', function(offerId) {
        logger.debug('Client joining room: ' + offerId);

        socket.join(offerId);
    });

    socket.on('disconnect', function () {
        logger.debug('Socket disconnected: ' + socket.id);
    });
}

module.exports = function (io) {

    var namespace = io.of('/offer');
    namespace.on('connection', onIOConnect);

    // setInterval(function () {
    //     io.emit('message', 'Message to all clients.');
    //     namespace.emit('message', 'Message to Offer Namespace only.');
    //     namespace.to('Offer_1234').emit('message', 'Message to Room Offer_1234 and Offer Namespace only.');
    //     namespace.to('THE ROOM').emit('message', 'Message to the default room');
    // }, 5000);

};
