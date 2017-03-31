/**
 * Created by beuttlerma on 28.03.17.
 */

function Component (id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
}


Component.prototype.CreateComponentFromJSON = function(jsonData) {

    return new Component(
        jsonData['componentuuid'],
        jsonData['componentname'],
        jsonData['componentdescription']
    );
};

module.exports = Component;