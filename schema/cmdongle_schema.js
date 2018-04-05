/* ##########################################################################
 -- Author: Marcel Ely Gomes
 -- Company: Trumpf Werkzeugmaschine GmbH & Co KG
 -- CreatedAt: 2017-02-27
 -- Description: Schema for TechnologyData
 -- ##########################################################################*/

const self = {};

self.LicenseUpdate_Body = {
    type: 'object',
    properties: {
        RAC: {
            type: 'string',
            pattern: '^[A-Za-z0-9+/]*={0,2}$'
        }
    },
    required: ['RAC'],
    additionalProperties: false
};

self.Empty = {
    type: 'object',
    properties: {},
    additionalProperties: false
};

module.exports = self;