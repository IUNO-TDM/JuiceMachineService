/**
 * Created by beuttlerma on 21.02.17.
 */

function User(id, firstname, lastname, email, thumbnail, imageReg) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.thumbnail = thumbnail;
    this.imageRef = imageReg;
}

module.exports = User;