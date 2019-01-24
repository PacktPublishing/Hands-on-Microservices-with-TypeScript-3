var gulp = require("gulp");
var ts = require("gulp-typescript");
var del = require("del");
var tsProject = ts.createProject("tsconfig.json");
var tslint = require("gulp-tslint");
var runSequence = require('run-sequence');

var outputFolder = "dist";

gulp.task("clean", function () {
	return del([outputFolder]);
});

gulp.task("lint", function () {
	return gulp.src(["src/**/*.ts", "!src/**/*.d.ts"])
		.pipe(tslint({
			formatter: "verbose",
			configuration: "./tslint.json"
		}))
		.pipe(tslint.report())
});

gulp.task("compile", function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest(outputFolder));
});

gulp.task("copyContent", function () {
	return gulp.src(["config.json", "Dockerfile","songs.json"]).pipe(gulp.dest(outputFolder));
});

gulp.task('default', gulp.series("clean", "lint", "compile", "copyContent"));