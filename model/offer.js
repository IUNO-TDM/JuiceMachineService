/**
 * Created by beuttlerma on 01.03.17.
 */

const Invoice = require('./invoice');
const Transfer = require('./transfer');

function Offer(id, invoice) {
    this.id = id;
    this.invoice = invoice;
}

/**
 *
 * @param jsonData
 * @returns {*}
 * @constructor
 */
Offer.prototype.CreateFromCoreJSON = Offer.CreateFromCoreJSON = function (jsonData) {
    if (!jsonData) {
        return null;
    }

    const transfers = [];
    for (let key in jsonData.invoice.transfers) {
        const transfer = jsonData.invoice.transfers[key];
        transfers.push(new Transfer(transfer.address, transfer.coin));
    }

    return new Offer(
        jsonData.id, //'id',
        new Invoice(jsonData.invoice.expiration, transfers)
    )
};

module.exports = Offer;