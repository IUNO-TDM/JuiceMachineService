/**
 * Created by beuttlerma on 01.03.17.
 */

var Invoice = require('./invoice');

function Offer(id, invoice) {
    this.id = id;
    this.invoice = invoice;
}


Offer.prototype.CreateFromCoreJSON = function(jsonData) {

    console.error('--- TODO: Implement this ---');
    //TODO: Implement this
    return new Offer(
        'id',
        new Invoice()
    )
};

module.exports = Offer;