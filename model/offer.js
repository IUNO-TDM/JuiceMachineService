/**
 * Created by beuttlerma on 01.03.17.
 */

var Invoice = require('./invoice');
var Transfer = require('./transfer');
function Offer(id, invoice) {
    this.id = id;
    this.invoice = invoice;
}


Offer.prototype.CreateFromCoreJSON = function (jsonData) {

    var transfers = [];
    for (var key in jsonData.invoice.transfers) {
        var transfer = jsonData.invoice.transfers[key];
        transfers.put(new Transfer(transfer.address, transfer.coin));
    }

    return new Offer(
        jsonData.id, //'id',
        new Invoice(jsonData.invoice.expiration, transfers)
    )
};

module.exports = Offer;