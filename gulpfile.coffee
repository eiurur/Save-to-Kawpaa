###*
gulpfile.jsにはrequire-dirだけ書いて、タスク名と同じ名前のJSファイルで管理していくと捗るということ。
gulpfile.jsにどんどんタスクを書いていくと、どんなタスクが登録されているのか中身を見ないとわからないけど、ファイル名と対応付けすると$ lsするだけでわかる。
###

# require-dirモジュールを使ってgulp/tasks以下を再帰的に読みこむようにします。
requireDir = require 'require-dir'

# 普通に書いていくと gulpfile.js がどんどん肥大化していくので、
# gulp/tasksディレクトリを作成してその中にタスクごとにファイルを作成していきます。
requireDir './gulp/tasks',
  recursive: true
