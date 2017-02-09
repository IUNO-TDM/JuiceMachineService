/**
 * Created by beuttlerma on 09.02.17.
 */

var OfferRequestSchema = {
    type: 'object',
    properties: {
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    recipeId: {
                        type: 'string',
                        required: true
                    },
                    amount: {
                        type: 'integer',
                        required: true
                    }
                }
            },
            required: true
        },
        hsmId: {
            type: 'string',
            required: true
        }
    }
};


module.exports = OfferRequestSchema;