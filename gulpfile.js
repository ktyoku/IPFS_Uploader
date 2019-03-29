var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "./src/index.html"
        }
    });
});

gulp.task('browserify', function() {
  return browserify('./src/js/index.js')
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./src/dist/'));
})

gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', function(){
  gulp.watch("./src/*.html", gulp.task('bs-reload'));
  gulp.watch("./src/css/*.css", gulp.task('bs-reload'));
  gulp.watch("./src/js/*.js", gulp.series('browserify', 'bs-reload'));
});

// src 配下の *.html, *.css ファイルが変更されたリロード。
gulp.task('default',
  gulp.series('browserify',
    gulp.parallel('browser-sync', 'watch'))
);

// gulp.task('default', ['browserify','browser-sync', 'watch']);
