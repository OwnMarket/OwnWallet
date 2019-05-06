const gulp = require("gulp"),
  inlinesource = require("gulp-inline-source");
  // inject = require("gulp-inject-string");

gulp.task("inline", function() {
  const options = {
    attribute: false,
    compress: false,
    pretty: true
  };

  return gulp
    .src("./dist/chainium-wallet/*.html")
    // Uncomment below lines in order to enable run index.html from file system. 
    // also set useHash:true for RouterModule
    // .pipe(
    //   inject.before(
    //     "</body>",
    //     "<script>document.write('<base href=\"' + document.location + '\" />');</script>\n"
    //   )
    // )
    .pipe(inlinesource(options))
    .pipe(gulp.dest("./dist/single-file-wallet"));
});
