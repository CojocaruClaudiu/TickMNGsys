const BundleTracker = require('webpack-bundle-tracker');

module.exports = function override(config, env) {
    config.plugins.push(
        new BundleTracker({ path: __dirname, filename: 'webpack-stats.json' })
    );
    return config;
};
