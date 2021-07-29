let projectFolder = "dist";
let sourceFolder = "#src";

let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/"
    },

    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{jpg, png, svg, git, ico, webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
        icons: sourceFolder + "/img/icons/"
    },

    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg, png, svg, git, ico, webp}",
    },

    clean: "./" + projectFolder

}

// ****************************************Variables

let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browser_sync = require("browser-sync").create(),
    file_include = require("gulp-file-include"),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    gulp_rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    webp = require('gulp-webp'),
    imagemin = require('gulp-imagemin'),
    webphtml = require('gulp-webp-html'),
    svg_sprite = require('gulp-svg-sprite')


// ****************************************

function browserSync(params) {
    browser_sync.init({
        server: {
            baseDir: path.clean,
           
        },
        browser: "chrome",
        port: 3000,
        notify: false
    })
}

// ****************************************

function html() {
    return src(path.src.html)
        .pipe(file_include())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browser_sync.stream())
}

// ****************************************

function img() {
    return src(path.src.img)
        .pipe(webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browser_sync.stream())
}


// ****************************************

function js() {
    return src(path.src.js)
        .pipe(file_include())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            gulp_rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browser_sync.stream())
}

// ****************************************

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                cascade: true
            })
        )
        .pipe(concat("styles.css"))
       
        .pipe(dest(path.build.css))
        .pipe(browser_sync.stream())
        .pipe(
            clean_css()
        )
        .pipe(
            gulp_rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browser_sync.stream())
}

// ****************************************

function watcher(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], img);
}


// ****************************************

gulp.task('svg', () => {
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svg_sprite({
            mode: {
                stack: {
                    sprite: '../icons/icons.svg',
                    example: true
                }
            }
        }
        ))
        .pipe(dest(path.src.icons))
})
// ****************************************
gulp.task('clean', () => {
  return del([path.clean])
})

// ****************************************

let build = gulp.series( gulp.parallel(js, html, css, img));
let watch = gulp.parallel(build, watcher, browserSync);


exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
