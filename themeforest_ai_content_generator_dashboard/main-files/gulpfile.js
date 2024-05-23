'use strict';
const { src, dest, series, watch } = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const tailwind = require('tailwindcss');

const fileinclude = require('gulp-file-include');
const run = require('gulp-run-command').default;

//browserSync
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

function html(cb) {
    src(['src/html/**'])
      .pipe(dest('dist'));
    cb();
}

function css() {
    return src('src/css/*.css')
      .pipe(sourcemaps.init())
      .pipe(postcss([
        postcssImport,
        tailwind]))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
      .pipe(dest('dist/assets/css'))
      .pipe(browserSync.stream())
}

function copy(cb) {
    src('src/images/**')
      .pipe(dest('dist/images'));

      src('src/assets/**')
      .pipe(dest('dist/assets'));
    cb()
}

function js_bundles(cb) {
  src('src/js/bundle.js')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      context: {
        nodeRoot: '../..',
        vendorRoot:'src',
      }
    }))
    .pipe(dest('dist/assets/js'));

    src(['src/js/scripts.js','src/js/**/*.js','!src/js/vendors/**'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        context: {
          nodeRoot: '../..',
          vendorRoot:'src',
        }
      }))
    .pipe(dest('dist/assets/js'));
    cb()
}

exports.develop = function () {
    browserSync.init({
        server: {
            baseDir: "./dist/",
            index: "index.html"
        },
        port:'4141'
    });
    
  watch(['src/html/**', 'src/css/**', 'src/js/**'], { ignoreInitial: false }, series(css));
  watch(['src/images/**','src/assets/**'], copy);
  watch(['src/html/*.html','src/html/**']).on('change', series(html,reload));
  watch(['src/js/**','src/js/**/**']).on('change', series(js_bundles,reload));
}

exports.build = series(copy,css,html,js_bundles)

exports.serve = run(['gulp build', 'gulp develop'])