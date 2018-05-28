/**
 * Created by beuttlerma on 28.03.17.
 */

function Component(id, name, description, displayColor) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.color = displayColor;
}

/**
 *
 * @param jsonData
 * @returns {*}
 * @constructor
 */
Component.prototype.CreateComponentFromJSON = Component.CreateComponentFromJSON = function (jsonData) {

    if (!jsonData) {
        return null;
    }

    return new Component(
        jsonData['componentuuid'],
        jsonData['componentname'],
        jsonData['componentdescription'],
        jsonData['displaycolor']
    );
};

module.exports = Component;