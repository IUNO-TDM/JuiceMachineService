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
        jsonData['technologydata'] //program
    )
};

module.exports = Recipe;
