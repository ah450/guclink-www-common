var gulp = require('gulp');
var fs = require('fs');
var gzip = require('gulp-gzip');
var merge = require('merge2');
var concat = require('gulp-concat');
var minimist = require('minimist');
var uglify = require("gulp-uglify");
var ngAnnotate = require('gulp-ng-annotate');
var minifyHtml = require('gulp-htmlmin');
var connect = require('gulp-connect');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');
var css = require('./gulp-tasks/css');
var assets = require('./gulp-tasks/assets');
var polyfills = require('./gulp-tasks/polyfills');
var scripts = require('./gulp-tasks/scripts');
var rimraf = require('rimraf');
var watch = require('gulp-watch');

gulp.task('bower-install', function() {
  // Runs bower install
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

gulp.task('bower', ['bower-install', 'create-dirs'], function() {
  // moves main files to lib folder
  return gulp.src(mainBowerFiles(), {base: 'bower_components'})
    .pipe(gulp.dest('libs'));
});


gulp.task('bower-dev', ['bower-install', 'create-dirs'], function() {
  // moves main files to lib folder
  return gulp.src(mainBowerFiles({
    includeDev: 'inclusive'
  }), {base: 'bower_components'})
    .pipe(gulp.dest('libs'));
});

gulp.task('create-dirs', function() {
  var dirs = ['build', 'dist', 'libs', 'test', 'compiledSpecs'];
  rimraf.sync('libs');
  dirs.forEach(function(dir) {
    try {
      fs.mkdirSync(dir);
    } catch(e) {
      if (e.code != 'EEXIST') {
        throw e;
      }
    }
  });
});



gulp.task('default', ['build']);

gulp.task('build', ['create-dirs', 'bower'], function() {
    var cssStream = css.processSass();
    var scriptStream = scripts.processScripts();
    var dependenciesStream = scripts.processDeps();
    var routesStream = scripts.processRoutes();
    var assetsStream = assets.processAssets();
    var polyfillsStream = polyfills.processPolyfills();
    var js = merge(dependenciesStream, scriptStream, routesStream)
      .pipe(concat('app.js'));
    var streams = merge([cssStream, js, assetsStream, polyfillsStream]);
    return streams.pipe(gulp.dest('build'))
});

var options = minimist(process.argv.slice(2), {
  string: 'dest',
  default: {dest: 'dist'}
})

gulp.task('production-helper', ['create-dirs', 'bower'], function() {
  var cssStream = css.processSass();
  var scriptStream = scripts.processScripts();
  var dependenciesStream = scripts.processDeps();
  var assetsStream = assets.processAssets();
  var polyfillsStream = polyfills.processPolyfills();
  var js = merge(dependenciesStream, scriptStream)
    .pipe(concat('guclink-common-angular-module.js'));
  var streams = merge([cssStream, js, assetsStream, polyfillsStream]);
  return streams
    .pipe(gulp.dest(options.dest));
});

gulp.task('production', ['production-helper']);


gulp.task('server', ['build'], function() {
  var proxyOpts = {
    target: 'http://localhost:3000',
    ws: true
  }
  connect.server({
    livereload: true,
    root: 'build',
    port: 8000,
    https: true
  });
});

gulp.task('reload', ['build'], function() {
  return gulp.src('./build/**/*')
    .pipe(connect.reload());
});

gulp.task('dev', ['watch', 'server']);

gulp.task('watch', function() {
  watch(['src/**', 'images/**', 'assets/**', 'polyfills/**', 'fonts/**', 'bower.json'], function() {
    gulp.start('reload');
  });
});



gulp.task('build-test', ['create-dirs', 'bower-dev'], function() {
  var scriptStream = scripts.processScripts();
  var dependenciesStream = scripts.processDeps().pipe(concat('app-deps.js'));
  var routesStream = scripts.processRoutes();
  var js = merge(scriptStream, routesStream)
    .pipe(concat('app-testing.js'))
  var appStreams = merge([dependenciesStream, js]).pipe(gulp.dest('test'))
  var specStream = scripts.processSpecs().pipe(gulp.dest('compiledSpecs'))
  return merge([appStreams, specStream]);
});


gulp.task('test', ['build-test'], function (done) {
  var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
