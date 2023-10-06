"use strict"

const {src, dest} = require("gulp")
const gulp = require("gulp")
const removeComments = require('gulp-strip-css-comments')
const size = require('gulp-size');
const rename = require('gulp-rename')
const gzip = require('gulp-gzip');
const fileinclude = require('gulp-file-include');
const cached = require('gulp-cached')
const dependents = require('gulp-dependents');
const sass = require('gulp-sass')(require('sass'))
const debug = require('gulp-debug');
const favicons = require('gulp-favicons')
const cssnano = require('gulp-cssnano')
const uglify = require('gulp-uglify')
const fonter = require('gulp-fonter-unx')
const ttf2woff2 = require('gulp-ttf2woff2')
const rigger = require('gulp-rigger')
const filter = require('gulp-filter')
const plumber = require('gulp-plumber')
const gulpHtmlImgWrapper = require('gulp-html-img-wrapper');
const panini = require('panini')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const autoprefixer = require("gulp-autoprefixer")
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')
const notify = require('gulp-notify')
const browserSync = require('browser-sync').create();


/*Пути*/
const srcPath = "src/"
const distPath = "dist/"

const path = {  //Пути к готовому проекту после сборки
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        images: distPath + "assets/images/",
        fonts: distPath + "assets/fonts/",
        favicon: distPath + "assets/images/favicon/",
    },
    src: { //Пути к исходникам проекта
        html: srcPath + "*.html",
        css: srcPath + "assets/sass/*.{sass, scss}",
        js: srcPath + "assets/js/*.js",
        images: srcPath + "assets/images/**/*.{png,jpg,jpeg,gif,svg}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        favicon: srcPath + "assets/images/favicon/*.{svg,png,jpg,jpeg}",
    },
    watch: { //Пути для watcher*a gulp
        html: srcPath + "**/*.html",
        css: srcPath + "assets/sass/**/*.{sass, scss}",
        js: srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/images/**/*.{png,jpg,jpeg,gif,svg}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        favicon: srcPath + "assets/images/favicon/*.{svg,png,jpg,jpeg}",
    },
    clean: "./" + distPath
}

/*Инициализация основных функций*/

/*Функция вызова сервера*/
function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
}

/*Функция вызова HTML*/
function html() { //
    panini.refresh()
    return src(path.src.html, {base: srcPath})
        .pipe(plumber())
        // .pipe(fileinclude({
        //     prefix: '@@',
        //     basepath: '@file'
        //   }))
        .pipe(panini({
                root: srcPath,
                layouts: srcPath + "tpl/layouts/",
                partials: srcPath + "tpl/partials/",
                data: srcPath + "tpl/data/",
            }
        ))
        .pipe(gulpHtmlImgWrapper({
            logger: true,
            extensions: ['.jpg', '.png', '.jpeg'],
        }))
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}))
        .pipe(size({
            showFiles: true,
        }))
}

/*Функция вызова CSS*/
function css() {
    return src(path.src.css, {base: srcPath + "assets/sass/"})
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SASS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end')
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(removeComments())
        .pipe(cssnano({
            zIndex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions'],
            grid: 'autoplace',
            browsers: [
                'last 8 versions',
                'Android >= 4',
                'Chrome >= 20',
                'Firefox >= 24',
                'Explorer >= 11',
                'iOS >= 6',
                'Opera >= 12',
                'Safari >= 6',
                'ie 6-8',
                'Firefox &gt; 20'
            ],
        }))
        .pipe(rename(
            {
                suffix: ".min",
                extname: ".css"
            }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.build.css))
        .pipe(gzip())
        .pipe(rename(
            {
                suffix: ".gz",
                extname: ".css"
            }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}))
        .pipe(size({
            showFiles: true,
        }))
}

/*Функция вызова JS*/
function js() {
    return src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end')
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(size({
            showFiles: true,
        }))
        .pipe(gzip())
        .pipe(rename({
            suffix: ".gz",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))
        .pipe(size({
            showFiles: true,
        }))
}

/*Функция фотографий*/

// function webpImages() {
//   return src(path.src.images, {base: srcPath + "assets/images/"})
//     .pipe(webp({quality: 78}))
//     .pipe(dest(path.build.images))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(size())
// }
function images() {
    return src(path.src.images, {base: srcPath + "assets/images/"})
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 80, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {optimizationLevel: 3},
                    {progessive: true},
                    {interlaced: true},
                    {removeViewBox: false},
                    {removeUselessStrokeAndFill: false},
                    {cleanupIDs: false}
                ]
            }),
        ]))
        .pipe(dest(path.build.images))
        .pipe(webp({quality: 82}))
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}))
        .pipe(size())
}

/*Функция favicon*/
function favicon() {
    return src(path.src.favicon, {base: srcPath + "assets/images/favicon"})
        .pipe(dest(path.build.favicon))
        .pipe(favicons({
            icons: {
                favicons: true,
                appleIcon: true,
                android: true,
                windows: true,
                yandex: true,
                coast: false,
                firefox: false,
                appleStartup: false
            }
        }))
        .pipe(dest(path.build.favicon))
        .pipe(filter(['favicon.ico', 'apple-touch-icon.png', 'manifest.json']))
        .pipe(dest(path.build.html))
        .pipe(size())
}

/*Функция шрифтов*/
function fonts() {
    return src('src/assets/fonts/*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(ttf2woff2())
        .pipe(src('src/assets/fonts/*.ttf'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(size())
        .pipe(dest(path.build.fonts))
}

/*Функция очистка папки готового проекта*/
function clean() {
    return del(path.clean)
}

/*Функция запуска FileWatcher*/
function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)
    gulp.watch([path.watch.favicon], favicon)
}

/*Запуск сборки проекта*/
const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts, favicon))
const watch = gulp.parallel(build, watchFiles, serve)

exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.favicon = favicon
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch
