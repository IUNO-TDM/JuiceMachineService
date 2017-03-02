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

User.prototype.CreateFromCoreJSON = function(jsonData) {

    console.error('--- TODO: Implement this ---');
    //TODO: Implement this
    return new User(
        'id',
        'firstName',
        'lastName',
        'email',
        'thumbnail',
        'imageRef'
    )
};

module.exports = User;