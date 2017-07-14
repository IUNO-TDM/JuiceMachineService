/**
 * Created by beuttlerma on 21.02.17.
 */

function User(id, username, firstname, lastname, email) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.username = username;
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
        jsonData['username'],
        jsonData['firstname'],
        jsonData['lastname'],
        jsonData['useremail']
    )
};

module.exports = User;