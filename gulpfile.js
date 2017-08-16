var gulp = require('gulp');
var browserify = require('browserify');
var brfs = require('brfs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var svgmin = require('gulp-svgmin');
var size = require('gulp-size');
var gutil = require('gulp-util');
var run = require('tape-run');
var cp = require('child_process');


//-----------------------------
// Gulp - Dev Tasks
//-----------------------------
gulp.task('html:copy', copyHTML);
gulp.task('img:copy', copyImage);
gulp.task('img:svg-min', ['img:copy'], svgMin); // Will call 'img:copy' task as a dependency
gulp.task('js:bundle', jsBundle); // Bundle all client scripts
gulp.task('sass:compile', sassCompile);
gulp.task('watch', watchFiles);
gulp.task('dev', ['html:copy', 'img:svg-min', 'js:bundle', 'sass:compile', 'watch']); // Build client assets - main task for continuous development
gulp.task('default', ['html:copy', 'img:svg-min', 'js:bundle', 'sass:compile']); // Default task simply builds assets into 'dist' directory


//-----------------------------
// Gulp - Test Tasks
//-----------------------------
gulp.task('client-tests:bundle', clientTestsBundle); // Bundle client-side test files
gulp.task('client-tests:run:browser', ['client-tests:bundle'], clientTestsBrowser); // Run client tests by opening a browser window
gulp.task('client-tests:run:headless', ['client-tests:bundle'], clientTestsHeadless); // Run client-tests using PhantomJS via tap-run
gulp.task('client-tests:watch', ['client-tests:run:headless'], clientTestsWatch); // Rerun client tests upon file changes
gulp.task('server-tests:run', serverTestsRun);
gulp.task('server-tests:watch', ['server-tests:run'], serverTestsWatch); // Rerun server tests upon file changes
gulp.task('run-tests', ['client-tests:run:headless', 'server-tests:run'], runTests); // Run both server and client tests - suitable for CI
gulp.task('run-tests:watch', ['client-tests:watch', 'server-tests:watch']);


//-----------------------------
// Dev Tasks Functions
//-----------------------------
function copyHTML() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
}

function copyImage() {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('dist/img'));
}

function svgMin() {
  return gulp.src('src/img/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/img'));
}

function jsBundle() {
  var bundleStream = browserify({
    entries: 'src/backbone/app.js',
    debug: true, // enable source maps
    transform: [brfs] // handlebars templates
  });

  return bundleStream.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(size())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist'));
}

function sassCompile() {
  return gulp.src('src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
}

function watchFiles() {
  gulp.watch('src/**/*.html', ['html:copy']);
  gulp.watch('src/img/**/*', ['img:svg-min']);
  gulp.watch('src/**/*.js', ['js:bundle']);
  gulp.watch('src/**/*.scss', ['sass:compile']);
  gulp.watch('src/**/*.hbs', ['js:bundle']);
}


//-----------------------------
// Test Tasks Functions
//-----------------------------
function clientTestsBundle() {
  // Bundle all client-side tests scripts
  var bundleStream = browserify({
    entries: 'tests/client/tests/main.js',
    debug: true,
    transform: [brfs]
  });

  return bundleStream.bundle()
    .pipe(source('tests-bundle.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest('tests/client'));
}

function clientTestsBrowser() {
  // Use child process 'spawn' to open HTML file with tests bundle
  var child = cp.spawn('open', ['tests/client/index.html']);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

function clientTestsHeadless() {
  browserify({
    entries: 'tests/client/tests/main.js',
    debug: true,
    transform: [brfs]
  })
    .bundle()
    .pipe(run({browser: 'phantom'}))
    .on('results', function(results) {
      if (!results.ok) {
        process.exitCode = 1;
        console.log('Client Tests Exit Code:', process.exitCode);
      } else {
        // Will not set process.exitCode to 0 since it can affect server tests own exit code
        console.log('Client Tests Exit Code: 0');
      }
    })
    .pipe(process.stdout);
}

function clientTestsWatch() {
  gulp.watch('tests/client/tests/**/*.js', ['client-tests:run:headless']);
}

function serverTestsRun() {
  // Use child process 'spawn' to run main test file
  var child = cp.spawn('node', ['tests/server/main.js']);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('exit', function(code) {
    process.exitCode = code;
    console.log('Server Tests Exit Code: ', process.exitCode);
  });
}

function serverTestsWatch() {
  gulp.watch('tests/server/**/*.js', ['server-tests:run']);
}

function runTests() {
  process.on('exit', function(code) {
    console.log('\nAll Tests Exit Code: ', code);
  });
}
