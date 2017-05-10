var gulp = require('gulp'),
    browserify = require('browserify'),
    brfs = require('brfs'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gulputil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function() {
  return gulp.src('./src/sass/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});


// Browserify + brfs transforms for Backbone + Handlebars templates
gulp.task('bundle', function() {
  var b = browserify({
    entries: './src/backbone/app.js',
    debug: true,
    transform: [brfs]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gulputil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});


// Gulp main tasks
gulp.task('build', ['sass', 'bundle']);

gulp.task('build:watch', function() {
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.js', ['bundle']);
});
