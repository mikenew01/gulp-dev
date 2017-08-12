const gulp        = require('gulp'),
      browserSync = require('browser-sync').create(),
      sass        = require('gulp-sass'),
      cssmin      = require('gulp-cssmin'),
      cssComments = require('gulp-strip-css-comments'),
      babel       = require('gulp-babel'),
      uglify      = require('gulp-uglify'),
      concat      = require('gulp-concat'),
      inject      = require('gulp-inject'),
      autoprefix  = require('gulp-autoprefixer'),
      notify      = require('gulp-notify'),
      gulpIf      = require('gulp-if'),
      cleanCss    = require('gulp-clean-css'),
      rev         = require('gulp-rev'),
      reload      = browserSync.reload;

//compile sass in css
gulp.task('sass', () => {
    return gulp.src("./src/styles/scss/**/*.scss") 
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('bundle.min.css')) 
        .pipe(cssComments({all: true}))
        .pipe(autoprefix({browsers: ['last 3 versions', '> 5%'], cascade: false}))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest("./src/build/css")) 
        .pipe(rev.manifest())
        .pipe(browserSync.stream())
        .pipe(notify('[OK] - Compilação do SASS para CSS'));
});

//Transpile ES6
gulp.task('esJs', () => {
    return gulp.src('./src/js/*.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat('bundle.min.js'))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(rev())
        .pipe(gulp.dest('./src/build/js'))
        .pipe(rev.manifest())
        .pipe(notify('[OK] - Transpile do JSEs6 para JS'));
});

//Inject js and css
gulp.task('index-inject', () => {
    return gulp.src('./src/**/*.html')
    .pipe(inject(gulp.src(['./src/build/css/*.css', './src/build/js/*.js'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./src/'))
    .pipe(notify('[OK] - Injeção do JS e CSS na página index'));
});


gulp.task('serve', ['sass', 'esJs', 'index-inject'], () => {
    browserSync.init({
        server: "./src"
    });

    gulp.watch("./src/styles/scss/**/*.scss", ['sass']);
    gulp.watch("./src/**/*.html").on("change", reload);
});

gulp.task('default', ['serve', 'esJs', 'index-inject']);    
