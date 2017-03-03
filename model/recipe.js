/**
 * Created by beuttlerma on 07.02.17.
 */



function Recipe (id, title, description, licenseFee, thumbnail, imageRef, authorId, createdAt, updatedAt, rating, retailPrice, productId, program) {


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

}
// class methods
Recipe.prototype.CreateRecipeFromJSON = function(jsonData) {
    return new Recipe(
        jsonData.id,
        jsonData.title,
        jsonData.description,
        jsonData.licencefee,
        jsonData.thumbnail,
        jsonData.imageRef,
        jsonData.authorId,
        jsonData.createdAt,
        jsonData.updatedAt,
        jsonData.rating,
        jsonData.retailPrice,
        jsonData.productId,
        jsonData.program
    );
};

Recipe.prototype.CreateRecipeFromCoreJSON = function(jsonData) {

    return new Recipe(
        jsonData['technologydatauuid'],
        jsonData['technologydataname'],
        jsonData['technologydatadescription'],
        jsonData['licencefee'],
        jsonData['technologydatathumbnail'],
        jsonData['technologydataimgref'], //TODO: Redirect image ref on juice machine service
        jsonData['technologydataauthor'],
        jsonData['createdat'],
        jsonData['updatedat'],
        null, //TODO: Rating still missing
        jsonData['licencefee'], //TODO: Calculate retail price
        null, //TODO: Is this id needed?
        jsonData['technologydata']
    )
};

module.exports = Recipe;
