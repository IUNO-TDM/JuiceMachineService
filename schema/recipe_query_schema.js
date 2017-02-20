/**
 * Created by beuttlerma on 09.02.17.
 */

var RecipeQuerySchema = {
    type: 'object',
    properties: {
        createdAfter: {
            type: 'string',
            format: ' date-time',
            required: false
        },
        machineType: {
            type: 'string',
            required: true
        },
        ingredients: {
            type: 'array',
            items: {
                type: 'string'
            },
            required: true
        }
    }
};

module.exports = RecipeQuerySchema;