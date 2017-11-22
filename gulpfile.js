console.info(1);

var gulp = require("gulp"),
    ld   = require("gulp-livereload");


gulp.task("watch",function() {

	ld.listen();

	gulp.watch("./**/*.*",function(file) {

		ld.changed(file.path);

	});

});