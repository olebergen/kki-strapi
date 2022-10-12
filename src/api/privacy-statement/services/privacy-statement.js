'use strict';

/**
 * privacy-statement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::privacy-statement.privacy-statement');