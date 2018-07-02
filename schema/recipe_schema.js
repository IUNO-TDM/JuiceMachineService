/**
 * Created by beuttlerma on 09.02.17.
 */

const self = {};

const languageProperty = {
    type: 'string',
    enum: ['de', 'en']
};


self.Empty = {
    type: 'object',
    properties: {},
    additionalProperties: false
};

self.GetContent_Query = {
    type: 'object',
    properties: {
        offerId: {
            type: 'string',
            format: 'uuid'
        }
    },
    required: ['offerId'],
    additionalProperties: false
};

self.Recipe_Query = {
    type: 'object',
    properties: {
        components: {
            type: 'array',
            items: {
                type: 'string',
                format: 'uuid'
            },
            additionalItems: false
        },
        lang: languageProperty
    },
    required: ['components', 'lang'],
    additionalProperties: false
};


module.exports = self;