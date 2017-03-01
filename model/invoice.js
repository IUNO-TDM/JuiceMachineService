/**
 * Created by beuttlerma on 01.03.17.
 */

function Invoice (expiration, transfers) {
    self.expiration = expiration;
    self.transfers = transfers;
}


module.exports = Invoice;