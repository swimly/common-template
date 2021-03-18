const gulp = require('gulp')
const through = require('through2')
const rollup = require('rollup')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const pkg = require('./package.json')
const concat = require('gulp-concat')
const cleancss = require('gulp-clean-css')
const filter = require('gulp-filter')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const reload = browserSync.reload
sass.compiler = require('node-sass')
const rename = require('gulp-rename')

// 开发环境
const env = process.env.NODE_ENV
const isDev = env == 'development'
const plugins = require('./rollup.config')(isDev)

// 启动本地服务器
const startServer = async () => {
  var server = browserSync.init({
    server: {
      baseDir: './'
    },
    open: false
  })
  // 监听文件
  gulp.watch('./src/**/*.scss', gulp.series(bundleSass))
  gulp.watch(['src/components/**/index.ts', './index.ts'], gulp.series(bundleTypescript))
  gulp.watch(['src/components/**/readme.md'], gulp.series(transfercomponentmd))
  gulp.watch(['src/components/**/read.md'], gulp.series(transferwebmd))
  gulp.watch(['*.html', 'docs/*.md', 'docs/**/*.md', 'docs/assets/styles/*.css', 'docs/assets/plugins/*.js']).on('change', reload)
}

const transfercomponentmd = async () => {
  gulp.src('./src/components/**/readme.md')
    .pipe(gulp.dest('docs/webcomponent'))
    .pipe(reload({stream: true}))
}

const transferwebmd = async () => {
  gulp.src('./src/components/**/read.md')
    .pipe(rename((path) => {
      return {
        dirname: path.dirname,
        basename: path.basename + 'me',
        extname: '.md'
      }
    }))
    .pipe(gulp.dest('docs/common'))
    .pipe(reload({stream: true}))
}

// 开发环境打包sass
const bundleSass = async () => {
  const output = isDev ? `${pkg.output}` : `${pkg.output}/${pkg.version}`
  gulp.src('./src/components/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      sourceMap: true
    }).on('error', (err) => {
      console.log(err)
      reload({ stream: true })
    }))
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(cleancss())
    .pipe(concat(`${pkg.name}.css`))
    .pipe(gulp.dest(output))
    .pipe(reload({stream: true}))
    .pipe(filter('**/*.css'))
}

// 生产环境打包主题文件
const bundleTheme = async () => {
  gulp.src('./src/theme/**/index.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: true
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(cleancss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${pkg.output}/${pkg.version}/themes/`))
}

// rollup打包
const bundleRollup = async (filepath, format) => {
  var input = filepath == 'index.ts' ? filepath : `src/components/${filepath}`
  var arr = filepath.split('index')
  var name = filepath == 'index.ts' ? pkg.name : arr[0].replace(pkg.prefix, '').replace(/\\/, '')
  var file = isDev ? `${pkg.output}/${pkg.name}.js` : `${pkg.output}/${pkg.version}/${name}/index.${format}.js`
  rollup.rollup({
    input,
    plugins
  }).then(bundle => {
    bundle.write({
      file,
      format,
      name
    })
  })
}

const bundleTypescript = async () => {
  // 监听目录
  const dirs = isDev ? ['./index.ts'] : ['./index.ts', 'src/components/**/index.ts']
  // rollup导出格式
  const format = isDev ? ['umd'] : ['umd', 'cjs', 'amd', 'es', 'iife']
  gulp.src(dirs)
    .pipe(through.obj((file, enc, cb) => {
      format.forEach((f, i) => {
        bundleRollup(file.relative, f)
      })
      cb()
    }))
}

exports.dev = gulp.series(startServer, bundleSass, bundleTypescript)
exports.build = gulp.series(bundleTypescript, bundleSass, bundleTheme)
