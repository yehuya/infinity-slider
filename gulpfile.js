var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglifyjs');
var rename = require('gulp-rename');

gulp.task('css', function(){
	return gulp.src('src/*.css')
	.pipe(cssmin())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist/'));
});

gulp.task('js', function(){
	return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/'))
});

gulp.task('default', ['css', 'js']);
