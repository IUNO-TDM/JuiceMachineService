/**
 * Created by beuttlerma on 01.03.17.
 */

function Invoice (expiration, transfers) {
    this.expiration = expiration;
    this.transfers = transfers;
}

//TODO: Add total amount

module.exports = Invoice;