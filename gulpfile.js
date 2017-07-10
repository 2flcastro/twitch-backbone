var gulp = require('gulp');
var browserify = require('browserify');
var brfs = require('brfs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var svgmin = require('gulp-svgmin');
var gutil = require('gulp-util');
var run = require('tape-run');
var cp = require('child_process');


// -----------
// GULP TASKS:
// -----------
// - 'default': performs the same tasks as 'dev', but will not keep watch over file
//    changes. Meant as a one step build.
//
// - 'dev': meant for development purposes. Will compile all assests from 'src'
//    directory and into the 'dist' directory for client-side use. Additionaly, it
//    will keep watching for changes on any files in the 'src' directory and repeat
//    the process.


// Copy index files from src to dist
gulp.task('html:copy', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Copy images from src to dist
gulp.task('img:copy', function() {
  gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

// // Minify SVG files, will run 'copy:img' first
// gulp.task('img:svg', ['img:copy'], function() {
//   gulp.src('src/img/**/*.svg')
//     .pipe(svgmin())
//     .pipe(gulp.dest('dist/img'));
// });


// Browserify + brfs transforms for Backbone + Handlebars templates
gulp.task('js:bundle', function() {
  var bundleStream = browserify({
    entries: 'src/backbone/app.js',
    debug: true,
    transform: [brfs]
  });

  return bundleStream.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

// Sass Processing
gulp.task('sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

// Watch .scss and .js files for changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.html', ['copy:html']);
  gulp.watch('src/img/**/*', ['copy:img', 'svg-ming']);
  gulp.watch('src/**/*.js', ['js:bundle']);
  gulp.watch('src/**/*.scss', ['sass']);
});


gulp.task('default', ['html:copy', 'img:copy', 'js:bundle', 'sass']);

gulp.task('dev', ['copy:html', 'copy:img', 'svg-min', 'js:bundle', 'sass', 'watch']);


// ----------
// UNIT TESTS
// ----------
// Server:
// -------
// - 'server-tests:run': will run all server-side related tests.
//
// - 'server-tests:watch': will keep track of server-side tests files and re-run the
//    tests on change. Best use is for dev work on server tests.
//
// Client:
// -------
// - 'client-tests:bundle': will bundle all client-tests into a single file for use
//   in browser.
//
// - 'client-tests:run:browser': performs the above task and will also open a browser window
//   where the tests will run.
//
// - 'client-tests:run:auto': this will bundle client-tests files and automatically
//   run the tests in a phantom.js headless browser via the command line. This is the
//   preferred way of running client-side tests once.
//
// - 'client-tests:watch': will watch client-tests files rerun them automatically in
//   the command line on changes. Will also re-bundle client-tests if browser testing
//   is needed. Best use if for dev work on client-side tests.
// ----------------------------------

// Run server-side tests
gulp.task('server-tests:run', function() {
  // Use child_process 'spawn' to run main test file
  var child = cp.spawn('node', ['tests/server/main.js']);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
});

// Watch for changes to server tests files and automaticall run tests
gulp.task('server-tests:watch', function() {
  var child = cp.spawn('node', ['tests/server/main.js']);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  gulp.watch('tests/server/**/*.js', ['server-tests:run']);
});

// Bundle client tests for in-browser testing, produces tests-bundle.js file
gulp.task('client-tests:bundle', function() {
  var bundleStream = browserify({
    entries: 'tests/client/tests/main.js',
    debug: true,
    transform: [brfs]
  });

  return bundleStream.bundle()
    .pipe(source('tests-bundle.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('tests/client'));
});

// Run client tests in browser:
// Opens browser window, use dev-tools to see tests results
gulp.task('client-tests:run:browser', ['client-tests:bundle'],function() {
  exec('open tests/client/index.html', function(err, stdout, stderr) {
    if (err) { return console.error(err); }
  });
});

// Automate client-side tests using tape-run and phantom.js
gulp.task('client-tests:run:auto', function() {
  browserify({
    entries: 'tests/client/tests/main.js',
    debug: true,
    transform: [brfs]
  })
    .bundle()
    .pipe(run({browser: 'phantom'}))
    // .on('results', console.log)
    .pipe(process.stdout);
});

// Watch for changes on client-side tests and automatically run them
gulp.task('client-tests:watch', function() {
  gulp.watch('./tests/client/tests/**/*.js', ['client-tests:bundle', 'client-tests:run:auto']);
});
