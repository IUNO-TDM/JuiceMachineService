/**
 * Created by beuttlerma on 07.02.17.
 */

var Component = require('./component');

function Recipe (id, title, description, licenseFee, thumbnail, imageRef, authorId, createdAt, updatedAt, rating, retailPrice, productId, program, components) {


    this.id = id;
    this.title = title;
    this.description = description;
    this.licencefee = licenseFee;
    this.thumbnail = thumbnail;
    this.imageRef = imageRef;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.rating = rating;
    this.retailPrice = retailPrice;
    this.productId = productId;
    this.program = program;
    this.components = components;

}

Recipe.prototype.CreateRecipeFromCoreJSON = function(jsonData) {
    var component = [];
    for (var key in jsonData['componentswithattribute']) {
        component.push(new Component().CreateComponentFromJSON(jsonData['componentswithattribute'][key]));
    }

    return new Recipe(
        jsonData['technologydatauuid'], //id
        jsonData['technologydataname'], //title
        jsonData['technologydatadescription'], //description
        jsonData['licensefee'], //licencefee
        jsonData['technologydatathumbnail'], //thumbnail
        null, //imageRef TODO: Remove imageRef from model as it is not needed. The image url always is /{id}/image
        jsonData['createdby'], //authorId
        jsonData['createdat'], //createdAt
        jsonData['updatedat'], //updatedAt
        null, //rating TODO: Rating still missing
        jsonData['retailprice'], //retailPrice TODO: Calculate retail price
        null, //productId TODO: Is this id needed?
        jsonData['technologydata'],//program
        component
    )
};

module.exports = Recipe;
