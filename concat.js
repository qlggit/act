module.exports = [
    {
        src:[
            './build/js/plugin/**',
            './build/js/common/**',
            './build/validate/validate.js',
        ],
        concatName:'main.js',
        destPath:'./build/js/build/'
    },
    {
        src:[
            './build/js/page/vote/index.js',
            './build/js/page/vote/extend/**',
        ],
        concatName:'vote.js',
        destPath:'./build/js/build/'
    },
    {
        src:[
            './build/js/page/vote/user-info.js',
        ],
        concatName:'vote-user-info.js',
        destPath:'./build/js/build/'
    },
];