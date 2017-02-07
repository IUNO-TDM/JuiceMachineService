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


module.exports = Recipe;
