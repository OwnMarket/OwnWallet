const { src, dest, series } = require('gulp');
const inlinesource = require('gulp-inline-source');

function inline() {
  const options = {
    attribute: false,
    compress: false,
    pretty: true,
  };
  return src('./dist/chainium-wallet/*.html').pipe(inlinesource(options)).pipe(dest('./dist/single-file-wallet'));
}

exports.default = series(inline);
