(function () {
    'use strict';

    const browserify = require('browserify');
    const spawn = require('child_process').spawn;
    const del = require('del');
    const gulp = require('gulp');
    const sourcemaps = require('gulp-sourcemaps');
    const ts = require('gulp-typescript');
    const uglify = require('gulp-uglify');
    const merge = require('merge2');
    const path = require('path');
    const buffer = require('vinyl-buffer');
    const source = require('vinyl-source-stream');

    const tsProject = ts.createProject('./tsconfig.json');

    const paths = {
        typeDefinitions: 'dist/definitions/',
        inputTypescript: 'src/ts/',
        output: 'dist/',
        outputJavascript: 'dist/js/',
        assetWatchPatterns: ['src/**/*', '!src/{ts,ts/**}']
    };

    gulp.task('clean', () => {
        del(paths.output);
    });

    gulp.task('transpile', () => {
        const tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return merge([
            tsResult.dts.pipe(gulp.dest(paths.typeDefinitions)),
            tsResult.js
                .pipe(sourcemaps.write({ sourceRoot: paths.inputTypescript }))
                .pipe(gulp.dest(paths.outputJavascript))
        ]);
    });

    gulp.task('bundle', ['transpile'], () => {
        return browserify({
            entries: [path.join(paths.outputJavascript, 'main.js')],
            debug: true
        })
        .bundle()
        .pipe(source(path.join(paths.outputJavascript, 'main.min.js')))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
    });

    gulp.task('assets', () => {
        return gulp.src(paths.assetWatchPatterns)
            .pipe(gulp.dest(paths.output));
    });

    gulp.task('build', ['assets', 'bundle']);

    gulp.task('serve', () => {
        spawn('node', ['server/app.js'], { stdio: 'inherit' });
    });

    gulp.task('watch-ts', () => gulp.watch(['./src/**/*.ts'], ['bundle']));
    gulp.task('watch-assets', () => gulp.watch(paths.assetWatchPatterns, ['assets']));
    gulp.task('watch', ['clean', 'build', 'watch-ts', 'watch-assets', 'serve']);
}());
