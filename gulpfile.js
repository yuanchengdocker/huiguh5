const clean = require('gulp-clean');
const gulp = require('gulp');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify')
const px2rem = require('gulp-px3rem');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
var runSequence = require('run-sequence')
var through2 = require('through2')

const webpack = require('webpack')
const webpackVueConfig = require('./config/webpack.vue.config.js')
const webpackReactConfig = require('./config/webpack.react.config.js')

const isDev = process.env.NODE_ENV === 'development' ? true : false;

/*
 * px2rem 的相关配置
 */
function tranpx() {
    return px2rem({
        baseDpr: 2,             // base device pixel ratio (default: 2)
        threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
        remVersion: true,       // whether to generate rem version (default: true)
        remUnit: 75,            // rem unit value (default: 75)
        remPrecision: 6         // rem precision (default: 6)
    })
}

gulp.task('serve', [], function () {
    browserSync.init({
        open: false,
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./src/pages/**/**/*.styl', ['stylus']).on('change', browserSync.reload);
    gulp.watch('./src/components/common/**/*.styl', commonWatch).on('change', browserSync.reload);
    gulp.watch('./src/components/general/**/*.styl', generalWatch).on('change', browserSync.reload);
    gulp.watch('./src/pages/**/**/*.js', ['uglify']).on('change', browserSync.reload);
    gulp.watch('./src/components/common/**/*.js', commonWatch).on('change', browserSync.reload);
    gulp.watch('./src/components/general/**/*.js', generalWatch).on('change', browserSync.reload);
    gulp.watch('./src/img/*.{png,jpg,gif,ico}', ['testImagemin']).on('change', browserSync.reload);
    gulp.watch('./src/imgWX/*.{png,jpg,gif,ico}', ['testImagemin']).on('change', browserSync.reload);
    gulp.watch('./src/common/**', ['copy']).on('change', browserSync.reload);
    gulp.watch('./src/commonWX/**', ['copy']).on('change', browserSync.reload);
    gulp.watch('./src/pages/**/*.html', ['copy']).on('change', browserSync.reload);
    gulp.watch('./src/components/common/**/*.html', commonWatch).on('change', browserSync.reload);
    gulp.watch('./src/components/general/**/*.html', generalWatch).on('change', browserSync.reload);

    gulp.watch('./app/*', ['webpack']).on('change', browserSync.reload);
    gulp.watch('./app/**/*', ['webpack']).on('change', browserSync.reload);
    gulp.watch('./app/**/**/*', ['webpack']).on('change', browserSync.reload);

    gulp.watch('./client/*', ['webpack-react']).on('change', browserSync.reload);
    gulp.watch('./client/**/*', ['webpack-react']).on('change', browserSync.reload);
    gulp.watch('./client/**/**/*', ['webpack-react']).on('change', browserSync.reload);
});

function commonWatch(e){
    watchClean(e)
    runSequence(['moveCommonHtml'],['stylus2'],['uglify2'],['revGeneralJS'],['revCommon'],['revCommonHTML'])
}

function generalWatch(e){
    watchClean(e)
    runSequence(['moveGeneralHtml'],['stylus3'],['uglify3'],['revGeneralHtml'],['revGeneralJS'])
}

function watchClean(e){
    var path = e.path.replace(/src/,"build")
    var type = path.substring(path.lastIndexOf('\.')+1,path.length)
    var wei = ""
    switch(type){
        case 'styl': wei = 'css';break;
        default: wei = type;break;
    }
    path = path.split('\\')
    path.pop()

    path = path.join('\\') + "\\*." + wei

    gulp.src(path).pipe(clean())
    console.log(path)
}

gulp.task('testImagemin', function () {
    gulp.src('./src/img/**/**')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./build/img'));

    return gulp.src('./src/imgWX/**/**')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./build/imgWX'));
});


gulp.task('stylus', function () {
    return gulp.src('./src/pages/**/**/*.styl')
        .pipe(stylus({
            compress: false
        }))
        .pipe(tranpx())
        .pipe(cssmin())
        .pipe(rename(function (path) {
            path.basename = path.basename.split(".")[0];
        }))
        .pipe(gulp.dest('./build/css'))
});

//公共模块css编译
gulp.task('stylus2', function () {
    return gulp.src('./src/components/common/**/*.styl')
        .pipe(stylus({
            compress: false
        }))
        .pipe(tranpx())
        .pipe(cssmin())
        .pipe(rename(function (path) {
            path.basename = path.basename.split(".")[0];
        }))
        .pipe(rev())
        .pipe(gulp.dest('./build/components/common'))
        .pipe(rev.manifest('css-rev.json'))
        .pipe(gulp.dest('./build/components/common/rev'))
});

//业务模块css编译
gulp.task('stylus3', function () {
    return gulp.src('./src/components/general/**/*.styl')
        .pipe(stylus({
            compress: false
        }))
        .pipe(tranpx())
        .pipe(cssmin())
        .pipe(rename(function (path) {
            path.basename = path.basename.split(".")[0];
        }))
        .pipe(rev())
        .pipe(gulp.dest('./build/components/general'))
        .pipe(rev.manifest('css-rev.json'))
        .pipe(gulp.dest('./build/components/general/rev'))
});

gulp.task('uglify', function () {
    return gulp.src('./src/pages/**/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
})

//公共模块js编译
gulp.task('uglify2', function () {
    return gulp.src('./src/components/common/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        // .pipe(uglify()) 
        .pipe(rev())
        .pipe(gulp.dest('./build/components/common'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest('./build/components/common/rev'))
})
gulp.task('uglify2-dev', function () {
    return gulp.src('./src/components/**/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./build/components'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest('./build/components/common/rev'))
})
//去掉.js后缀，因为requirejs的引用一般都不带后缀
gulp.task("replaceSuffix", function (cb) {
    return gulp.src(['./build/components/common/*.json'])
        .pipe(modify(replaceSuffix))            //- 去掉.js后缀
        .pipe(gulp.dest('./build/components/common'))
});
//业务模块js编译
gulp.task('uglify3', function () {
    return gulp.src('./src/components/general/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(uglify())  
        .pipe(rev())
        .pipe(gulp.dest('./build/components/general'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest('./build/components/general/rev'))
})
gulp.task('uglify3-dev', function () {
    return gulp.src('./src/components/general/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./build/components/general'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest('./build/components/general/rev'))
})


gulp.task('copy', function () {
    gulp.src('src/common/css/*.css')
        .pipe(gulp.dest('./build/common/css'));
    gulp.src('src/common/css/public/*.css')
        .pipe(stylus({
            compress: false
        }))
        .pipe(tranpx())
        .pipe(cssmin())
        .pipe(rename(function (path) {
            path.basename = path.basename.split(".")[0];
        }))
        .pipe(gulp.dest('./build/common/css/public'));

    gulp.src('src/common/js/*.js')
        .pipe(gulp.dest('./build/common/js'));

    gulp.src('src/commonWX/css/*.css')
        .pipe(gulp.dest('./build/commonWX/css'));

    gulp.src('src/commonWX/js/*.js')
        .pipe(gulp.dest('./build/commonWX/js'));

    gulp.src('download/**')
        .pipe(gulp.dest('./build/commodule/download'));

    gulp.src('introduction/**')
        .pipe(gulp.dest('./build/commodule/introduction'));

    gulp.src('src/pages/**/*.html')
        .pipe(gulp.dest('./build/pages'));

    gulp.src('src/pages/serverPack/**')
        .pipe(gulp.dest('./build/pages/serverPack'));

});

gulp.task('moveCommonHtml',function(){
    return gulp.src('src/components/common/**/*.html')
    .pipe(rev())
    .pipe(gulp.dest('./build/components/common'))
    .pipe(rev.manifest('html-rev.json'))
    .pipe(gulp.dest('./build/components/common/rev'))
})

gulp.task('moveGeneralHtml',function(){
    return gulp.src('src/components/general/**/*.html')
    .pipe(gulp.dest('./build/components/general'))
})

function modify(modifier) {
    return through2.obj(function (file, encoding, done) {
        var content = modifier(String(file.contents));
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}
function replaceSuffix(data) {
    var temp = data.replace(/\.js/gmi, "");
    var result = temp.replace(/\":/gmi, "\.js\":");
    return result
}

//更新general目录下html里面js，css的引用地址
gulp.task('revGeneralHtml', function () {
    return gulp.src(['./build/components/general/rev/*.json', './build/components/general/**/*.html'])
        .pipe(revCollector({ replaceState: true }))
        .pipe(gulp.dest('./build/components/general'))
})
//更新require.js配置文件common.js名称
gulp.task('revGeneralJS', function () {
    return gulp.src(['./build/components/common/rev/js-rev.json', './build/components/general/**/*.js'])
        .pipe(revCollector({ replaceState: true }))
        .pipe(gulp.dest('./build/components/general'))
})

//公共模块配置文件里面的js，css地址修改
gulp.task('revCommon', function () {
    return gulp.src(['./build/components/common/rev/*.json', './build/components/common/*.js'])
        .pipe(revCollector({ replaceState: true }))
        .pipe(modify(replaceSuffix)) 
        .pipe(gulp.dest('./build/components/common'))
})
//公共模块js文件对html的引用地址修改
gulp.task('revCommonHTML', function () {
    return gulp.src(['./build/components/common/rev/html-rev.json', './build/components/common/**/*.js'])
        .pipe(revCollector({ replaceState: true }))
        .pipe(gulp.dest('./build/components/common'))
})


gulp.task('clean', function () {
    return gulp.src('./build/')
        .pipe(clean());
});


gulp.task('webpack', function(callback){
    webpack(webpackVueConfig, function(err, stats) {
        callback();
    });
})

gulp.task('webpack-react', function(callback){
    webpack(webpackReactConfig, function(err, stats) {
        callback();
    });
})


gulp.task('production', function (done) {
    condition = false;
    runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        ['clean'],
        ['stylus'],
        ['stylus2'],
        ['stylus3'],
        ['uglify'],
        ['uglify2'],
        ['uglify3'],
        ['copy'],
        ['testImagemin'],
        ['moveCommonHtml'],
        ['moveGeneralHtml'],
        ['revCommon'],
        ['revCommonHTML'],
        ['revGeneralJS'],
        ['revGeneralHtml'],
        ['webpack'],
        ['webpack-react'],
        done);
})
gulp.task('default', function (done) {
    condition = false;
    runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        ['clean'],
        ['stylus'],
        ['stylus2'],
        ['stylus3'],
        ['uglify'],
        ['uglify2-dev'],
        ['uglify3-dev'],
        ['copy'],
        ['testImagemin'],
        ['moveCommonHtml'],
        ['moveGeneralHtml'],
        ['revCommon'],
        ['revCommonHTML'],
        ['revGeneralJS'],
        ['revGeneralHtml'],
        ['serve'],
        done);
})