/**
 * Created by beuttlerma on 01.03.17.
 */

var Invoice = require('./invoice');

function Offer(id, invoice) {
    this.id = id;
    this.invoice = invoice;
}


Offer.prototype.CreateFromCoreJSON = function(jsonData) {

    return new Offer(
        jsonData.id, //'id',
        new Invoice(jsonData.invoice.expiration, jsonData.invoice.transfers)
    )
};

module.exports = Offer;