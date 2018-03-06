const path = require('path');
const { dependencies } = require('./package.json');

const deps = Object.keys(dependencies || {})

const sharedConfig = {
    dist: path.join(__dirname, 'wwwroot', 'dist', 'dll'),
    vendors: deps.filter(dependency =>
        dependency !== 'bootstrap' &&
        dependency !== 'arragrocms-management'
    )
}

module.exports = sharedConfig
