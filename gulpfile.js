//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');

var less = require('gulp-less'),
    livereload = require('gulp-livereload');

//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function () {
    gulp.watch(['./www/*.html'], ['html']);
    livereload.listen(); //要在这里调用listen()方法
    gulp.watch('less/*.less', ['less']);
});

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: 'www',
        livereload: true
  });
});

gulp.task('html', function () {
    gulp.src('./www/*.html')
        .pipe(connect.reload());
});

//运行Gulp时，默认的Task
gulp.task('default', ['connect', 'watch']);

gulp.task('less', function() {
  gulp.src('less/*.less')
      .pipe(less())
      .pipe(gulp.dest(__dirname + '/public/css'))
      .pipe(livereload());
});