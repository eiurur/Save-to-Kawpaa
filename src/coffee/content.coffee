$ ->


  getToken = ->
    return new Promise (resolve, reject) ->

      keys = [ 'token' ]
      chrome.storage.sync.get keys, (item) ->

        console.log item

        if item.token is undefined or item.token is ''
          console.log 'token is undefined'
          return reject undefined

        console.log item.token
        return resolve item.token

  save2Server = (post) ->

    # 開発用
    destUrl = 'http://127.0.0.1:9021/api/posts'
    # destUrl = 'https://ona-it-later.herokuapp.com/api/posts'

    getToken()
    .then (token) ->
      alertify.log "保存中 ......"

      console.log token

      # post.token = token

      $.ajax
        type: "POST"
        url: destUrl
        data:
          token: token
          post: post
        headers:
          "Access-Control-Allow-Origin": "*"
      .done (data) ->
        console.log data
        alertify.success "保存しました。"
      .fail (err) ->
        console.log err
    .catch (err) ->
      console.log err
      alertify.error "トークンに誤りがあります。\nもう一度確認してみてください。"

  do ->

    data = {}

    console.log '=============>'

    console.log '=======> info'

    #
    console.log info
    # info = JSON.parse info
    # console.log info.srcUrl

    # タイトル
    console.log '=======> タイトル'
    console.log title1 = $('head title').text()
    console.log title2 = $('meta[property="og:title"]').attr('content')
    data.title = title1 or title2

    # サイトの名前
    console.log '=======> サイトの名前'
    console.log siteName = $('meta[property="og:site_name"').text()
    data.siteName = siteName

    # サイトURL
    console.log '=======> サイトのURL'
    console.log siteUrl1 = $(location).attr('href')
    console.log siteUrl2 = $('meta[property="og:url"]').attr('content')
    data.siteUrl = siteUrl1 or siteUrl2

    # URL
    # .jpgとかのURL。
    # コンテキストメニューからなら

    #そうでないなら
    if info?.mediaType? && info.mediaType is 'image'
      data.url = info.srcUrl
      data.type = 'image'
    else
      data.url = data.siteUrl
      data.type = 'link'

    # ホスト名?
    console.log hostName = location.host
    data.hostName = hostName

    # 説明
    console.log '=======> 説明'
    console.log description1 = $('meta[name="description"]').attr('content')
    console.log description2 = $('meta[property="og:description"]').attr('content')
    data.description = description1 or description2

    # 画像
    console.log '=======> サイトの画像'
    console.log siteImage = $('meta[property="og:image"]').attr('content')
    data.siteImage = siteImage

    # favixon
    console.log '=======> faviconのURL'
    console.log favicon = $('link[rel="shortcut icon"]').prop('href')
    data.favicon = favicon

    # MongooseのDefaultが動作しないので、初期値を手動で設定
    data.isPrivate = true
    data.isArchive = false
    data.isDone = false

    console.log data

    save2Server data
