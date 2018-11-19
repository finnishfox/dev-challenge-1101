const gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-html-minifier2'),
    cleanCSS = require('gulp-clean-css'),
    svgmin = require('gulp-svgmin'),
    svgSprite = require('gulp-svg-sprite'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    pump = require('pump'),
    Terser = require("terser"),
    include = require("gulp-include");


gulp.task('connect', () =>
    connect.server({
        root: 'docs'
    }));

gulp.task('html', ['svg-sprite'], () =>
    gulp.src('./src/pages/*.html')
        .pipe(include())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./docs'))
        .pipe(connect.reload()));


gulp.task('sass-to-css', () => gulp.src(['src/styles/reset.css', 'src/styles/blocks/*.scss', 'src/styles/fonts.scss'])
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./docs/styles')));

gulp.task('js', () => gulp.src('src/scripts/blocks/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./docs/scripts')));

gulp.task('svg-sprite', () =>
    gulp.src('src/images/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgSprite({
            shape: {
                transform: [
                    {
                        svgo: {
                            plugins: [
                                {removeStyleElement: false},
                                {inlineStyles: false}
                            ]
                        }
                    }
                ]
            },
            svg: {
                xmlDeclaration: false,
                doctypeDeclaration: false,
                namespaceIDs: false,
                namespaceClassnames: false,
                dimensionAttributes: true,
            },
            mode:
                {
                    symbol: {
                        inline: true,
                        sprite: "sprite.svg",
                        dest: 'svgsprite',
                        example: false,
                    }
                }
        }))
        .pipe(gulp.dest('./docs'))
);


gulp.task('copy', () =>
    gulp.src('src/fonts/**/*', {
        base: 'src'
    }).pipe(gulp.dest('./docs')));

gulp.task('imagemin', () =>
    gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('docs/images'))
);

gulp.task('watch', () =>
    gulp.watch(['./src/**/**'], [
        'html',
        'sass-to-css',
        'js',
        'copy']));

gulp.task('default', ['html', 'connect', 'sass-to-css', 'js', 'imagemin', 'watch']);
