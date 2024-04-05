// plug-in
const { src, dest, watch } = require("gulp");
const inquirer = require("inquirer");
const include = require("gulp-file-include");
const convertEncoding = require("gulp-convert-encoding");
const browserSync = require("browser-sync");
const cache = require("gulp-cached"); // CRUD 이력이 없으면 빌드 하지 않음
const gulpSass = require("gulp-sass");
const sourceMaps = require("gulp-sourcemaps");
const minify = require("gulp-uglify");
const sprite = require("gulp.spritesmith"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat");
const { createProxyMiddleware } = require("http-proxy-middleware");
const minifyCSS = require('gulp-minify-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
// util
const nodePath = require("path");
const fs = require("fs");
const url = require("url");
const iconvLite = require("iconv-lite");
const currentFolder = (() => {
  __dirname.split("media");
})();
/* TASK */
const watcher = {}; // watch 파일 리스트
let PATH = null; // src Path

function sass() {
  console.log("start-sass");
  return new Promise((resolve, reject) => {
    try {
      watcher["sass"] = [PATH.src + "sass/*.scss", PATH.src + "sass/**/*.scss"];
      src(watcher["sass"])
        .pipe(sourceMaps.init())
        .pipe(
          gulpSass({
            sourceComments: false,
            outputStyle: "compressed",
          })
        )
        .on("error", function (err) {
          console.log(err);
          this.emit("end");
        })
        .pipe(sourceMaps.write("./"))
        .pipe(convertEncoding({ to: "euc-kr" }))
        .pipe(dest(PATH.dist + "css/"));
      // .pipe(browserSync.reload({ stream: true }));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function regacySass() {
  console.log("start-regacy-sass");
  return new Promise((resolve, reject) => {
    try {
      watcher["sass"] = [PATH.srcCSS + "*.scss", PATH.srcCSS + "**/*.scss"];
      src(watcher["sass"])
        .pipe(
          gulpSass({
            sourceComments: false,
            outputStyle: "expanded",
          })
        )
        .on("error", function (err) {
          console.log(err);
          this.emit("end");
        })
        .pipe(convertEncoding({ to: "euc-kr" }))
        .pipe(dest(PATH.distCSS + "/"));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function regacySassMin() {
  console.log("start-regacy-sass");
  return new Promise((resolve, reject) => {
    try {
      watcher["sass"] = [PATH.srcCSS + "*.scss", PATH.srcCSS + "**/*.scss"];
      src(watcher["sass"])
        .pipe(
          gulpSass({
            sourceComments: false,
            outputStyle: "compressed",
          })
        )
        .on("error", function (err) {
          console.log(err);
          this.emit("end");
        })
        .pipe(convertEncoding({ to: "euc-kr" }))
        .pipe(dest(PATH.distCSSMin + "/"));
      // .pipe(browserSync.reload({ stream: true }));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function regacyJs() {
  return new Promise((resolve, reject) => {
    try {
      watcher["js"] = [PATH.srcJS + "*.js", PATH.srcJS + "**/*.js"];
      src(watcher["js"])
        .on("error", function (err) {
          console.log(err);
          this.emit("end");
        })
        .pipe(convertEncoding({ to: "euc-kr" }))
        .pipe(dest(PATH.distJS + "/"));
      // .pipe(browserSync.reload({stream: true}))
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function regacyJsMin(){
  return new Promise((resolve, reject) => {
    try {
      watcher["js"] = [PATH.srcJS + "*.js", PATH.srcJS + "**/*.js"];
      src(watcher["js"])
        .pipe(minify())
        .on("error", function (err) {
          console.log(err);
          this.emit("end");
        })
        .pipe(convertEncoding({ to: "euc-kr" }))
        .pipe(dest(PATH.distJSmin + "/"));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function setSprite() {
  try {
    watcher["sprite"] = [
      PATH.images + "sprite/*.png",
      PATH.images + "sprite/*.jpg",
      PATH.images + "sprite/*.jpeg",
      PATH.images + "sprite/*.gif",
    ];

    const date = new Date().getTime();
    const spriteData = src(watcher["sprite"]).pipe(
      sprite({
        retinaSrcFilter: [ PATH.images +'sprite/*-x2.png' ],
        imgName: "sprite.png",
        padding: 10,
        retinaImgName: 'spritex2.png',
        imgPath: PATH.spriteSrc + "sprite.png?" + date,
        retinaImgPath : PATH.spriteSrc + 'spritex2.png?' + date,
        cssName: "_sprite.scss",
      })
    );

    spriteData.img.pipe(dest(PATH.images));
    spriteData.css.pipe(dest(PATH.src + "sass/styles/"));
  } catch (e) {
    console.log("error", e);
  }
}

function regacySprite(path) {
  try {
    watcher["sprite"] = [
      PATH.images + "_sprite/*.png",
      PATH.images + "_sprite/*.jpg",
      PATH.images + "_sprite/*.jpeg",
      PATH.images + "_sprite/*.gif",
    ];

    const date = new Date().getTime();
    const spriteData = src(watcher["sprite"]).pipe(
      sprite({
        retinaSrcFilter: [PATH.images + "_sprite/*-2x.png"],
        imgName: "set_sprite.png",
        padding: 10,
        retinaImgName: "set_sprite-2x.png",
        imgPath: PATH.spriteSrc + "set_sprite.png?" + date,
        retinaImgPath: PATH.spriteSrc + "set_sprite-2x.png?" + date,
        cssName: path + "_sprite.css",
      })
    );

    spriteData.img.pipe(dest(PATH.images));
    spriteData.css.pipe(dest(PATH.spriteCSS));
  } catch (e) {
    console.log("error", e);
  }
}

function html(isRegacy) {
  return new Promise((resolve, reject) => {
    try {
      watcher["html"] = [PATH.src + "*.html", PATH.src + "**/*.html"];

      if (isRegacy) {
        watcher["html"].push("!" + PATH.src + "inc/*.html"); // include폴더 제외
        watcher["html"].push("!" + PATH.src + "**/inc/*.html"); // src > inc 폴더 제외
      }
      let P = __dirname.split("media")[0];
      P = P.replace(/\\/g, "/");

      src(watcher.html)
        .pipe(
          include({
            // 변수
            context: {
              SRC: `${P}media/new_trunk`,
              //_ROOT: ROOT + '/' + PATH.trunk + 'src',
              _ROOT: "../../",
              ROOT: "../../../../..",
              V2020: "../../../../../new_trunk/m/src/inc/module/",
              test: "http://placehold.it",
              _html: {
                top: '<div class="scroll_up_v2"><a href="#header">맨위로</a></div>', // font resize 적용되면서 하나 모듈로 합침
                temp: "http://m1.nateimg.co.kr/n3main/thumb.png",
                dumy: "https://via.placeholder.com",
              },
              strTest: "abcdefghigklmnoprstuvwxyz",
              enc: "euc-kr",
              live: "http://news.nateimg.co.kr/etc/ui/images",
            },
            prefix: "@@",
            basepath: "@file", //@file : include 경로 상대적 위치,  @root
          })
        )
        .on("error", function (err) {
          console.log(err.toString());
          this.emit("end");
        })
        .pipe(cache("html"))
        .pipe(convertEncoding({ to: "euc-kr" }))
        .pipe(dest(PATH.dist))
        .pipe(browserSync.reload({ stream: true }));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

const parse = function (req, res, next) {
  /* *
   * middleware charset Change
   * 산출물 및 DEV서버가 euc-kr이라 인코딩 이슈가 있음
   * 로컬에서는 utf8, 빌드 시 charset 변경한다.
   * */
  let urlParse = url.parse(req.url);

  if (/\.html$/.test(urlParse.pathname)) {
    let data = fs.readFileSync(nodePath.join("./", urlParse.pathname)),
      source = iconvLite.decode(Buffer.from(data, "binary"), "EUC-KR");

    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.end(source);
  } else {
    next();
  }
};

const proxy = createProxyMiddleware("/web", {
  target: "http://acticon.nateon.nate.com",
  changeOrigin: true,
  // onProxyRes: function (proxyRes, req, res) {
  //     proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:85';
  // }
});

function server() {
  browserSync({
    directory: true,
    notify: true,
    server: {
      baseDir: "./",
      middleware: [parse, proxy],
    },
    port: 85,
    ui: {
      weinre: {
        port: 9090,
      },
    },
    startPath: PATH.dist,
  });
}

function server2(){
  browserSync.init({
    directory: true,
    open: false,
    server: {
      baseDir: "./",
      middleware: [parse],
    },
    port: 85,
  });
}

function js() {
  return new Promise((resolve, reject) => {
    try {
      watcher["js"] = [PATH.src + "js/*"];

      src(watcher["js"])
        .pipe(sourceMaps.init())
        .pipe(minify())
        .on("error", function (err) {
          console.log(err);
          this.emit("end");
        })
        .pipe(sourceMaps.write("./"))
        .pipe(dest(PATH.dist + "js"));
      // .pipe(browserSync.reload({stream: true}))

      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function getPath(value) {
  const NAME = value;
  return new Promise((resolve) => {
    const type = NAME.split("_");
    if (type[0] === "regacy") {
      // 운영 경로
      resolve({
        trunk: `new_trunk/${type[1]}/`,
        src: `new_trunk/${type[1]}/src/doc/`,
        srcCSS: `new_trunk/${type[1]}/src/scss/`,
        srcJS: `new_trunk/${type[1]}/src/js/`,
        dist: `new_trunk/${type[1]}/release/html/`,
        distCSS: `new_trunk/${type[1]}/release/css/origin`,
        distCSSMin: `new_trunk/${type[1]}/release/css`,
        distJS: `new_trunk/${type[1]}/release/js/origin`,
        distJSmin: `new_trunk/${type[1]}/release/js/minified`,
      });
    } else if (type[0] === "sprite") {
      // 레거시 스프라이트 생성용
      resolve({
        images: `new_trunk/images/${type[1]}/${type[2]}/`,
        spriteSrc: `../../../../images/${type[1]}/${type[2]}/`,
        spriteCSS: `new_trunk/${type[2]}/release/css/${type[3]}/`,
      });
    } else {
      // 특집 경로
      resolve({
        src: `new_trunk/special/${type[0]}/${type[1]}/src/`,
        dist: `new_trunk/special/${type[0]}/${type[1]}/dist/`,
        images: `new_trunk/images/${type[0]}/${type[1]}/`,
        spriteSrc: `../../../../../images/${type[0]}/${type[1]}/`,
      });
    }
  });
}

function taskSelect() {
  // choices name rule: ${네임}_${m | pc}
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "theme",
        message: "실행 할 테스크를 선택 하세요",
        choices: [
          "regacy_pc",
          "regacy_m",
          "goodbye2022_pc",
          "goodbye2022_m",
          "vote2022_pc",
          "vote2022_m",
        ],
      },
    ])
    .then(async function (task) {
      const TASK = task.theme;
      let isRegacy = false;
      PATH = await getPath(TASK);

      if (TASK.split("_")[0] === "regacy") {
        // 운영 테스크
        isRegacy = true;
      } else {
        // 특집 테스크
        await sass();
        await js();
        watch(watcher["js"], js);
        watch(watcher["sass"], sass);
      }
      // 공통사용 테스크
      await html(isRegacy);

      server();
      watch(watcher["html"], html);
    });
}

async function special() {
  PATH = await getPath("goodbye2022_pc");
  // PATH = await getPath("qatar2022_pc");
  await html(true);
  await js();
  await sass();
  server2();
  watch(watcher["html"], html);
  watch(watcher["js"], js);
  watch(watcher["sass"], sass);
}
async function regacy_pc() {
  PATH = await getPath("regacy_pc");
  await html(true);
  await regacySass();
  await regacySassMin();
  await regacyJs();
  await regacyJsMin();
  server2();
  watch(watcher["html"], html);
  watch(watcher["sass"], regacySass);
  watch(watcher["sass"], regacySassMin);
  watch(watcher["js"], regacyJs);
  watch(watcher["js"], regacyJsMin);
}
async function regacy_m(){
  PATH = await getPath("regacy_m");
  server2();
  await html(true);
  watch(watcher["html"], html);
}

exports.special = special;
exports.regacy_pc = regacy_pc;
exports.regacy_m = regacy_m;

async function triggerSpriteTask() {
  await setSprite();
  watch(watcher["sprite"], setSprite);
}
exports.edgeJS_MIN = async () => {
  src(["new_trunk/edge/js/ui.js"])
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .on("error", function (err) {
      console.log(err);
      this.emit("end");
    })
    .pipe(concat("ui-min.js"))
    .pipe(minify())
    .pipe(dest("new_trunk/edge/js"));
};

exports.taskSelect = taskSelect;

exports.spriteVote2022_M = async () => {
  PATH = await getPath("vote2022_m");
  triggerSpriteTask();
};
exports.spriteGoodbye2022_PC = async () => {
  PATH = await getPath("goodbye2022_pc");
  // PATH = await getPath("qatar2022_pc");
  triggerSpriteTask();
};

exports.sprite_pc = async () => {
  // sprite_이미지폴더_피씨or모바일_css폴더 내 넣고싶은 폴더명
  PATH = await getPath("sprite_acticon_pc_sports");
  regacySprite("acticon");
};

async function minifyCssTask() {
  src(["new_trunk/m/release/css/*.origin.css"])
      .pipe(rename(function (path) {
        path.basename = path.basename.replace('.origin', '');
      }))
      .pipe(minifyCSS())
      .pipe(dest("new_trunk/m/release/css"))
}
exports.minifyCssTask = minifyCssTask;

async function minifyJavascriptTask() {
  src(['new_trunk/m/release/js/lib/ui.js', 'new_trunk/m/release/js/lib/MNComponent.js', 'new_trunk/m/release/js/lib/menu.js', 'new_trunk/m/release/js/lib/idol_scoller.js'])
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(convertEncoding({to: 'euc-kr'}))
      .pipe(dest("new_trunk/m/release/js/lib"));
}
exports.minifyJavascriptTask = minifyJavascriptTask;