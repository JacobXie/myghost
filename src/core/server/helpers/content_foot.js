// # Ghost content Helper
// Usage: `{{content_foot}}`
//
// Outputs scripts and other assets at the bottom of an article
//
// We use the name content_foot to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var hbs             = require('express-hbs'),
    _               = require('lodash'),
    config          = require('../config'),
    filters         = require('../filters'),
    api             = require('../api'),
    utils           = require('./utils'),
    content_foot;

content_foot = function (options) {
    var footOptions = (options || {}).hash || {},
        includeJquery;

    footOptions = _.pick(footOptions, ['jquery']);
    includeJquery = (_.has(footOptions, 'jquery') && footOptions.jquery === false ) ? false : true;

    /*jshint unused:false*/
    var jquery = utils.isProduction ? 'jquery.min.js' : 'jquery.js',
        foot = [];

    if(includeJquery) {
        foot.push(utils.scriptTemplate({
            source: config.paths.subdir + '/public/' + jquery,
            version: config.assetHash
        }));
    }
    

    return api.settings.read({key: 'content_foot'}).then(function (response) {
        foot.push(response.settings[0].value);
        return filters.doFilter('content_foot', foot);
    }).then(function (foot) {
        var footString = _.reduce(foot, function (memo, item) { return memo + ' ' + item; }, '');
        return new hbs.handlebars.SafeString(footString.trim());
    });
};

module.exports = content_foot;