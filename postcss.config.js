const autoprefixer = require('autoprefixer');
module.exports = {
    // 'parser': require('postcss-scss'),
    'map': 'inline',
    'plugins': [
        require('precss')(),
        require('postcss-cssnext')({
            browsers: ['Android >= 4', 'iOS >= 7', 'Chrome >= 10', 'Firefox >= 10', 'IE >= 10']
        }),
        autoprefixer()
    ]
}