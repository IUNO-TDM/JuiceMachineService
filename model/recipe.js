/**
 * Created by beuttlerma on 07.02.17.
 */

const Component = require('./component');

function Recipe(id, title, description, licenseFee, backgroundColor, authorId, productCode, components) {

    this.id = id;
    this.title = title;
    this.description = description;
    this.licensefee = licenseFee;
    this.backgroundColor = backgroundColor;
    this.authorId = authorId;
    this.productCode = productCode;
    this.components = components;

}

/**
 *
 * @param jsonData
 * @returns {*}
 * @constructor
 */
Recipe.prototype.CreateRecipeFromCoreJSON = Recipe.CreateRecipeFromCoreJSON = function (jsonData) {
    if (!jsonData) {
        return null;
    }
    const component = [];
    for (let key in jsonData['componentlist']) {
        component.push(Component.CreateComponentFromJSON(jsonData['componentlist'][key]));
    }

    return new Recipe(
        jsonData['technologydatauuid'], //id
        jsonData['technologydataname'], //title
        jsonData['technologydatadescription'], //description
        jsonData['licensefee'], //licencefee
        jsonData['backgroundcolor'],
        jsonData['createdby'], //authorId
        jsonData['productcode'],
        component
    )
};

module.exports = Recipe;
