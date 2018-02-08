/**
 * Created by beuttlerma on 07.02.17.
 */

var Component = require('./component');

function Recipe (id, title, description, licenseFee, thumbnail, imageRef, backgroundColor, authorId, createdAt, updatedAt, rating, retailPrice, productCode, program, components) {


    this.id = id;
    this.title = title;
    this.description = description;
    this.licensefee = licenseFee;
    this.thumbnail = thumbnail;
    this.imageRef = imageRef;
    this.backgroundColor = backgroundColor;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.rating = rating;
    this.retailPrice = retailPrice;
    this.productCode = productCode;
    this.program = program;
    this.components = components;

}

/**
 *
 * @param jsonData
 * @returns {*}
 * @constructor
 */
Recipe.prototype.CreateRecipeFromCoreJSON = function(jsonData) {
    if (!jsonData) {
        return null;
    }
    var component = [];
    for (var key in jsonData['componentlist']) {
        component.push(new Component().CreateComponentFromJSON(jsonData['componentlist'][key]));
    }

    return new Recipe(
        jsonData['technologydatauuid'], //id
        jsonData['technologydataname'], //title
        jsonData['technologydatadescription'], //description
        jsonData['licensefee'], //licencefee
        jsonData['technologydatathumbnail'], //thumbnail
        null, //imageRef TODO: Remove imageRef from model as it is not needed. The image url always is /{id}/image
        jsonData['backgroundColor'],
        jsonData['createdby'], //authorId
        jsonData['createdat'], //createdAt
        jsonData['updatedat'], //updatedAt
        null, //rating TODO: Rating still missing
        jsonData['retailprice'], //retailPrice
        jsonData['productcode'],
        jsonData['technologydata'],//program
        component
    )
};

module.exports = Recipe;
