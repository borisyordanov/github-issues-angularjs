const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const inject = require('gulp-inject');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify-css');
const runSequence = require('run-sequence');
const debug = require('gulp-debug');
const series = require('stream-series');
const ngAnnotate = require('gulp-ng-annotate');
const webserver = require('gulp-webserver');
const stripDebug = require('gulp-strip-debug');

const allSass = ['assets/**/*.scss', 'app/**/*.scss'];
const allJs = 'app/**/*.js';
const jsSrcLocation = [
	'app/**/*module.js',
	'app/**/*service.js',
	'app/**/*model.js',
	allJs
];
const vendorSaveLocation = 'build/js/vendors';
const jsSaveLocation = 'build/js/app';
const cssDevSaveLocation = 'build/styles';
const cssProdSaveLocation = 'build/css';
const dependencies = ['node_modules/angular/angular.min.js', 'node_modules/angular-ui-router/release/angular-ui-router.min.js'];

gulp.task('server', function() {
	gulp.src('.').pipe(
		webserver({
			livereload: true,
			directoryListing: true,
			open: 'index.html'
		})
	);
});

gulp.task('sass-dev', function() {
	return (gulp
			.src(allSass, { base: './' })
			.pipe(debug())
			//convert sass to css
			.pipe(sass().on('error', sass.logError))
			.pipe(
				autoprefixer({
					browsers: ['> 5%'],
					cascade: false
				})
			)
			.pipe(gulp.dest(cssDevSaveLocation)) );
});

gulp.task('sass', function() {
	return (gulp
			.src(allSass, { base: './' })
			.pipe(debug())
			//convert sass to css
			.pipe(sass().on('error', sass.logError))
			.pipe(
				autoprefixer({
					browsers: ['> 5%'],
					cascade: false
				})
			)
			.pipe(sourcemaps.init())
			.pipe(concat('style.css'))
			.pipe(sass().on('error', sass.logError))
			//add sourcemaps
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(cssProdSaveLocation))
			//add minified version
			.pipe(rename('style.min.css'))
			.pipe(minify())
			.pipe(gulp.dest(cssProdSaveLocation)) );
});

gulp.task('js', function() {
	return gulp
		.src([...jsSrcLocation], { base: './' })
		.pipe(debug())
		.pipe(concat('scripts.js'))
		.pipe(debug())
		.pipe(ngAnnotate())
		.pipe(gulp.dest(jsSaveLocation))
		.pipe(rename('scripts.min.js'))
		.pipe(stripDebug())
		.pipe(uglify())
		.on('error', err => {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest(jsSaveLocation));
});

gulp.task('vendors', function() {
	return gulp
		.src(dependencies, { base: './' })
		.pipe(debug())
		.pipe(concat('vendors.js'))
		.pipe(ngAnnotate())
		.pipe(gulp.dest(vendorSaveLocation))
		.pipe(rename('vendors.min.js'))
		.pipe(uglify())
		.on('error', err => {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest(vendorSaveLocation));
});

gulp.task('includes', function() {
	var target = gulp.src('index.html');
	var vendorStream = gulp.src([`${vendorSaveLocation}/vendors.min.js`], {
		read: false
	});
	var sourcesStream = gulp.src(
		[`${jsSaveLocation}/**/*min.js`, `${cssProdSaveLocation}/**/*.css`],
		{ read: false }
	);

	return target
		.pipe(inject(series(vendorStream, sourcesStream)))
		.pipe(gulp.dest('.'));
});

gulp.task('includes-dev', function() {
	var target = gulp.src('index.html');
	var vendorStream = gulp.src(dependencies, {
		read: false
	});
	var sourcesStream = gulp.src(
		[...jsSrcLocation, `${cssDevSaveLocation}/**/*.css`],
		{ read: false }
	);

	return target
		.pipe(inject(series(vendorStream, sourcesStream)))
		.pipe(gulp.dest('.'));
});

gulp.task('watcher', function() {
	gulp.watch(allSass, ['build']);
	gulp.watch(allJs, ['build']);
});

gulp.task('watcher-dev', function() {
	gulp.watch(allSass, ['build-dev']);
});

gulp.task('build', function() {
	runSequence(['vendors', 'js', 'sass'], 'includes', 'server');
});

gulp.task('build-dev', function() {
	runSequence('sass-dev', 'includes-dev', 'server');
});

gulp.task('default', function() {
	gulp.start('watcher');
});
