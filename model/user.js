/**
 * Created by beuttlerma on 21.02.17.
 */

function User(id, firstname, lastname) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
}

/**
 *
 * @param jsonData
 * @returns {*}
 * @constructor
 */
User.prototype.CreateFromCoreJSON = function (jsonData) {

    if (!jsonData) {
        return null;
    }

    return new User(
        jsonData['id'],
        jsonData['firstname'],
        jsonData['lastname']
    )
};

module.exports = User;