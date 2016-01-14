path = require "path"
dest = "./build"
src  = "./src"

#//
# path.relative(from, to)
#
# path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
# returns
# '../../impl/bbb'
#
# gulp-watchの第一引数にはglobで監視対象のパスを指定するのですが、パスの先頭を./みたいに.から始めると正常に動作しません。
# それで./src/js/**みたいなパスをpath.relative()を使ってsrc/js/**に直す必要があります。
# これで監視対象以下でファイルの追加や削除があってもwatchしてくれるようになりました。
relativeSrcPath = path.relative(".", src)
module.exports =

  # 出力先の指定
  dest: dest

  coffee:
    src: src + "/coffee/*.coffee"
    dest: dest + "/js/"


  jade:
    src: src + '/**/!(_)*.jade'
    dest: dest + '/views'

  images_copy:
    src: src + "/images/**"
    dest: dest + '/images/'

  sass:
    src: [src + "/sass/**//!(_)*"] # ファイル名の先頭がアンスコはビルド対象外にする
    dest: dest + "/css/"

  bower_js:
    src: [
      'bower_components/jquery/dist/jquery.min.js'
      'bower_components/alertify.js/lib/alertify.min.js'
    ]
    dest: dest + "/js/vendors/"

  bower_options_js:
    src: [
      'bower_components/bootstrap/dist/js/bootstrap.min.js'
      'bower_components/moment/moment.js'
    ]
    dest: dest + "/js/vendors/"

  bower_css:
    src: [
      # 'bower_components/font-awesome/css/font-awesome.min.css'
      'bower_components/bootstrap/dist/css/bootstrap.min.css'
      'bower_components/alertify.js/themes/alertify.core.css'
      'bower_components/alertify.js/themes/alertify.default.css'
    ]
    dest: dest + "/css/vendors/"

  bower_font:
    src: [
      'bower_components/font-awesome/fonts/*'
    ]
    dest: dest + '/css/fonts/'

  clean:
    target: './build'

  watch:
    coffee: relativeSrcPath + "/coffee/*.coffee"
    sass: relativeSrcPath + "/sass/*.scss"
    jade: relativeSrcPath + "/views/**"
    images_copy: relativeSrcPath + "/images/**"