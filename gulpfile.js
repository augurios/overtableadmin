var gulp = require('gulp');
var inject = require('gulp-inject');
var es = require('event-stream');
var concat = require('gulp-concat');
var series = require('stream-series');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require("gulp-rename");


gulp.task('dev', function () {

  var target = gulp.src('./public/template/index.html');
    
  var lib = gulp.src(['./public/app/libs/*.js'], {read: false});
  var core = gulp.src(['./public/app/core/*js'], {read: false});
  var constantsfile = gulp.src(['./public/app/constants/*.js'], {read: false});
  var directives = gulp.src(['./public/app/directives/*.js'], {read: false});
  var routes = gulp.src(['./public/app/routes/*.js'], {read: false});
  var controller = gulp.src(['./public/app/controller/*.js'], {read: false});
  var factory = gulp.src(['./public/app/factory/*.js'], {read: false});
  var appModules = gulp.src(['./public/app/modules/**/*.js','./public/app/modules/**/**/*.js'], {read: false});
    return target.pipe(inject(series(lib,core,controller,constantsfile,routes,factory,appModules,directives)))
      .pipe(gulp.dest('./public/template/'));
});



gulp.task('uglyfy', function () {

var vendorStream = gulp.src([
	'./public/app/core/*.js',
	'./public/app/constants/*.js',
	'./public/app/directives/*.js',
	'./public/app/routes/*.js',
	'./public/app/controller/*.js',
	'./public/app/factory/*.js',
	'./public/app/modules/**/*.js',
  './public/app/modules/**/**/*.js'
	])
  .pipe(concat('library.js'))
  .pipe(ngAnnotate())
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify({ mangle: true }).on('error', function(e){
            console.log(e);
    }))
  .pipe(gulp.dest('./public/app/libs/'));
 });


gulp.task('addto', function () {
 
var target = gulp.src('./public/template/index.html');
   
var lib = gulp.src(['./public/app/libs/*.js'], {read: false});
  return target.pipe(inject(series(lib)))
    .pipe(gulp.dest('./public/template/'));
});

gulp.task('production', function() {
  gulp.start('uglyfy', 'addto');
})