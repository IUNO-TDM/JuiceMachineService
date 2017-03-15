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

User.prototype.CreateFromCoreJSON = function (jsonData) {

    return new User(
        jsonData.useruuid, //'id',
        jsonData.userfirstname, //'firstName',
        jsonData.userlastname, //'lastName',
        jsonData.useremail, //'email',
        null, //'thumbnail',
        null //imageRef TODO: Remove imageRef from model as it is not needed. The image url always is /{id}/image
    )
};

module.exports = User;