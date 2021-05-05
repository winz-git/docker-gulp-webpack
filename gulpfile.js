const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const es = require('event-stream');
const log = require('fancy-log');
const sourcemaps = require('gulp-sourcemaps');
const minimist = require('minimist');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');


const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'prod' }
};

let shouldMinify;
let withSourceMap;

const options = minimist(process.argv.slice(2), knownOptions);
if (options.env === 'prod') {
  shouldMinify = true;
  withSourceMap = false;
} else {
  shouldMinify = false;
  withSourceMap = true;
}

gulp.task('styles', function(cb) {
  es.concat(
      gulp.src(['node_modules/bootstrap/scss/**/bootstrap-grid.scss'])
          .pipe(gulpif(withSourceMap, sourcemaps.init()))
          .pipe(gulpif(shouldMinify, sass({outputStyle: 'compressed'}).on('error', sass.logError), sass().on('error', sass.logError)))
          .pipe(gulpif(withSourceMap, sourcemaps.write()))
          .pipe(gulp.dest('dist/css/vendor/')),
      gulp.src(['src/scss/home.scss'])
          .pipe(gulpif(withSourceMap, sourcemaps.init()))
          .pipe(gulpif(shouldMinify, sass({outputStyle: 'compressed'}).on('error', sass.logError), sass().on('error', sass.logError)))
          .pipe(gulpif(withSourceMap, sourcemaps.write()))
          .pipe(gulp.dest('dist/css/'))
  ).on('end', cb);
});

gulp.task('js', function(cb) {
  es.concat(
      gulp.src([
          'node_modules/jquery/dist/jquery.min.js',
          // 'node_modules/popper.js/dist/popper.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
      ])
          .pipe(gulpif(withSourceMap, sourcemaps.init()))
          .pipe(gulpif(shouldMinify, uglify()))
          .pipe(concat('bundle.js'))
          .pipe(gulpif(withSourceMap, sourcemaps.write()))
          .pipe(gulp.dest('dist/js/vendor/')),
      gulp.src(['src/js/index.js'])
          .pipe(gulpif(withSourceMap, sourcemaps.init()))
          .pipe(gulpif(shouldMinify, uglify()))
          .pipe(concat('index.js'))
          .pipe(gulpif(withSourceMap, sourcemaps.write()))
          .pipe(gulp.dest('dist/js')),
  ).on('end', cb);
});

gulp.task('clean', function () {
  return del(['dist/*', '!dist/index.html']);
});

gulp.task('build', gulp.series('clean', gulp.parallel('js', 'styles'), function(cb) {
  if (shouldMinify) {
    log('This build with minify.');
  } else {
    log('This build without minify.');
  }
  cb();
}));

// Watch files update for CSS and JS.
gulp.task('watch', function () {
  // Always for development purpose.
  shouldMinify = false;
  withSourceMap = true;
  gulp.watch(['src/scss/**/*.scss'], gulp.series('build'));
});
