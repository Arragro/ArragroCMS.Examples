function buildConfig(env) {
    if (!env)
        env = process.env.NODE_ENV;
    if (!env)
        env = 'development';
    return require('./webpack.' + env + '.config.js')
}

module.exports = buildConfig;