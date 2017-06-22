var gulp = require('gulp');
var browserify = require('browserify');
var brfs = require('brfs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

// Copy index files from src to dist
gulp.task('copy', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Sass Processing
gulp.task('sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

// Browserify + brfs transforms for Backbone + Handlebars templates
gulp.task('bundle', function() {
  var b = browserify({
    entries: 'src/backbone/app.js',
    debug: true,
    transform: [brfs]
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

// Watch .scss and .js files for changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.html', ['copy']);
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['bundle']);
});

gulp.task('dev', ['copy', 'sass', 'bundle', 'watch']);


// client-side unit tests files
gulp.task('bundle-client-tests', function() {
  var b = browserify({
    entries: './tests/client/main.js',
    debug: true,
    transform: [brfs]
  });

  return b.bundle()
    .pipe(source('tests-bundle.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('./tests/client'));
});

gulp.task('client-tests:watch', function() {
  gulp.watch('./tests/client/routers/router-test.js', ['bundle-client-tests']);
});
