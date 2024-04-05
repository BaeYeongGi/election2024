const { watch, src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const browserSync = require("browser-sync");
const cache = require("gulp-cached"); // CRUD 이력이 없으면 빌드 하지 않음
const sourceMaps = require("gulp-sourcemaps");
const gulpSass = require("gulp-sass");

// watch file list
const watcher = {}
let PATH = null;

function getPath(value){
  return new Promise((resolve) => {
    resolve({
      input: 'docs/src/',
      output: 'docs/dist/',
    })
  })
}

function server() {
  browserSync({
    directory: true,
    notify: true,
    server: {
      baseDir: "./",
    },
    port: 85,
    ui: {
      weinre: {
        port: 9090,
      },
    },
    startPath: PATH.output,
  });
}

function html(){
  return new Promise((resolve, reject) => {
    try {
      watcher["html"] = [PATH.input + "*.html/", PATH.input + "**/*.html"];
      src(watcher.html)
        .on("error", function(err){
          console.log(err.toString());
        })
        .pipe(cache("html"))
        .pipe(dest(PATH.output))
        .pipe(browserSync.reload({ stream: true }));
      resolve();
    } catch(e){
      reject(e);
    }
  })
}

function js(){
  return new Promise((resolve, reject) => {
    try {
      watcher["js"] = [PATH.input + "js/*"];
      src(watcher["js"])
        .pipe(sourceMaps.init())
        .pipe(uglify())
        .on("error", function(err){
          console.log(err)
        })
        .pipe(sourceMaps.write("./"))
        .pipe(dest(PATH.output + "js"));
      resolve();
    } catch(e) {
      reject(e);
    }
  })
}

function scss(){
  return new Promise((resolve, reject) => {
    try {
      watcher["scss"] = [PATH.input + "scss/*.scss", PATH.input + "scss/**/*.scss"];
      src(watcher["scss"])
        .pipe(sourceMaps.init())
        .pipe(
          gulpSass({
            sourceComments: true,
            outputStyle: "compressed",
          })
        )
        .on("error", function(err){
          console.log(err)
        })
        .pipe(sourceMaps.write("./"))
        .pipe(dest(PATH.output + "css/"));
      resolve();
    } catch(e) {
      reject(e);
    }
  })
}

// function copy(cb){
//   return src('docs/src/js/*.js', {
//     sourcemaps: true
//   })
//   .pipe(uglify())
//   .pipe(dest('docs/dist/js/', {
//     sourcemaps: true 
//   }))
//   .pipe(browserSync.reload({ stream: true }));
// }

async function election2024(){
  PATH = await getPath();
  await html();
  await js();
  await scss();
  watch(watcher["html"], html);
  watch(watcher["js"], js);
  watch(watcher["scss"], scss);
  server();
}

exports.election2024 = election2024;