const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const cssmin      = require('gulp-cssmin');
const cssComments = require('gulp-strip-css-comments');
const babel       = require('gulp-babel');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const inject      = require('gulp-inject');
const autoprefix  = require('gulp-autoprefixer');
const notify      = require('gulp-notify');
const gulpIf      = require('gulp-if');
const htmlmin     = require('gulp-htmlmin');
const reload      = browserSync.reload;


//compile sass in css
gulp.task('sass', () => {
    return gulp.src("./src/styles/scss/**/*.scss") 
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css')) 
        .pipe(gulp.dest("./src/build/css")) 
        .pipe(cssComments({all: true}))
        .pipe(autoprefix({browsers: ['last 3 versions', '> 5%'], cascade: false}))
        .pipe(browserSync.stream())
        .pipe(notify('[OK] - Compilação do SASS para CSS'));
});

//Transpile ES6
gulp.task('esJs', () => {
    return gulp.src('./src/js/*.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat('script.min.js'))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('./src/build/js'))
        .pipe(notify('[OK] - Transpile do JSEs6 para JS'));
});

//Inject js and css
gulp.task('index-inject', () => {
    return gulp.src('./src/**/*.html')
    .pipe(inject(gulp.src(['./src/build/css/*.css', './src/build/js/*.js'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./src/'))
    .pipe(notify('[OK] - Injeção do JS e CSS na página index'));
});

//Mimify Html to build
gulp.task('htmlmin', () => {
    return gulp.src('./src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./src/build/'))
    .pipe(notify('[OK] - Mimificando HTML'));
});

gulp.task('serve', ['sass', 'esJs', 'index-inject', 'htmlmin'], () => {
    browserSync.init({
        server: "./src"
    });

    gulp.watch("./src/styles/scss/**/*.scss", ['sass']);
    gulp.watch("./src/**/*.html").on("change", reload);
});

gulp.task('default', ['serve', 'esJs', 'index-inject', 'htmlmin']);    
