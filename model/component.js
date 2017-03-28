/**
 * Created by beuttlerma on 28.03.17.
 */

function Component (id, name, description) {
    this.id = id
    this.name = name;
    this.transfers = description;
}


Component.prototype.CreateComponentFromJSON = function(jsonData) {

    return new Recipe(
        jsonData['id'],
        jsonData['componentname'],
        jsonData['componentdescription']
    );
};

module.exports = Component;