//npm install gulp gulp-sass gulp-cssmin gulp-strip-css-comments gulp-babel gulp-uglify gulp-concat gulp-inject gulp-watch browser-sync --save-dev

const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const cssmin      = require('gulp-cssmin');
const cssComments = require('gulp-strip-css-comments');
const babel       = require('gulp-babel');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const inject      = require('gulp-inject');
const reload      = browserSync.reload;

gulp.task('serve', ['sass', 'esJs', 'index-inject'], () => {
    browserSync.init({
        server: "./src"
    });

    gulp.watch("./src/styles/scss/**/*.scss", ['sass']);
    gulp.watch("./src/**/*.html").on("change", reload);
});

//compile sass in css
gulp.task('sass', () => {
    return gulp.src("./src/styles/scss/**/*.scss") 
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css')) 
        .pipe(gulp.dest("./src/build/css")) 
        .pipe(cssComments({all: true}))
        .pipe(browserSync.stream());
});

//Transpile ES6
gulp.task('esJs', () => {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/build/js'));
});

//Inject js and css
//Error, not inject into html
gulp.task('index-inject', () => {
    return gulp.src('./src/index.html')
    .pipe(inject(gulp.src(['build/css/*.css', 'build/js/*.js'], {relative:true})))
    .pipe(gulp.dest('./src/'));
});

gulp.task('default', ['serve', 'esJs', 'index-inject']);
