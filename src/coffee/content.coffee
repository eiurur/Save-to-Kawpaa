$ ->

  save2Server = (data, token) ->
    return new Promise (resolve, reject) ->

      # 開発用(Win)
      # destUrl = 'https://127.0.0.1:9021/api/posts'

      # 開発用(Vagrant)
      # destUrl = 'https://192.168.33.10:9021/api/posts'

      # 本番用
      # destUrl = 'https://ona-it-later.herokuapp.com/api/posts'

      # 本番用(VPS)
      destUrl = 'https://tk2-207-13331.vs.sakura.ne.jp:9021/api/posts'

      $.ajax
        type: "POST"
        url: destUrl
        data:
          token: token
          post: data
        headers:
          "Access-Control-Allow-Origin": "*"
      .done (data) ->
        return reject data if data isnt 'ok' and data.statusCode isnt 200
        return resolve data
      .fail (err) ->
        return reject err

  getToken = ->
    return new Promise (resolve, reject) ->
      chrome.storage.sync.get ['token'], (item) ->
        return reject undefined　if item.token is undefined or item.token is ''
        return resolve item.token


  scrapingMetaData = ->
    return new Promise (resolve, reject) ->

      data = {}

      # タイトル
      # console.log '=======> タイトル'

      title1 = $('head title').text()
      # console.log title1

      title2 = $('meta[property="og:title"]').attr('content')
      # console.log title2

      data.title = title1 or title2

      # サイトの名前
      # console.log '=======> サイトの名前'

      siteName = $('meta[property="og:site_name"').text()
      # console.log siteName

      data.siteName = siteName

      # サイトURL
      # console.log '=======> サイトのURL'

      siteUrl1 = $(location).attr('href')
      # console.log siteUrl1

      siteUrl2 = $('meta[property="og:url"]').attr('content')
      # console.log siteUrl2

      data.siteUrl = siteUrl1 or siteUrl2

      console.log 'info =  ', info

      # TODO: linkならページ先のURLに対してスクレイピングを行う。

      # URL と type
      # コンテキストメニューから、かつ画像なら image そうでないなら link
      if info?.mediaType? && info.menuItemId is 'image' # image
        data.url = info.srcUrl
        data.type = 'image'
      # else if info?.mediaType? && info.menuItemId is 'video' # video
      #   data.url = info.srcUrl
      #   data.type = 'video'
      else  # page
        # bodyタグ内で一番最初の画像を引っ張ってくる
        firstImgUrlInBody = $('img').get(0).src
        data.url = firstImgUrlInBody
        data.type = 'link'

      # ホスト名
      hostName = location.host
      # console.log hostName

      data.hostName = hostName

      # 説明
      # console.log '=======> 説明'

      description1 = $('meta[name="description"]').attr('content')
      # console.log description1

      description2 = $('meta[property="og:description"]').attr('content')
      # console.log description2

      data.description = description1 or description2

      # 画像
      # console.log '=======> サイトの画像'

      siteImage = $('meta[property="og:image"]').attr('content')
      # console.log siteImage

      data.siteImage = siteImage

      # favixon
      # console.log '=======> faviconのURL'

      favicon = $('link[rel="shortcut icon"]').prop('href')
      # console.log favicon

      data.favicon = favicon

      # MongooseのDefaultが動作しないので、初期値を手動で設定
      data.isPrivate = true
      data.isArchive = false

      # console.log data

      return resolve data

  # アイコンに色をつけて、完了したことをわかるようにする。通知もする。
  displatySuccessResult = ->
    chrome.runtime.sendMessage({ "newIconPath" : 'build/images/blue/icon19.png' })
    alertify.success "保存しました。"

  displatyFailedResult = (err) ->
    console.log err

    # Ajaxに失敗
    if err.status?
      err.statusCode = err.status
      err.statusMessage = err.statusText

    # Base64に変換をかますときとかにこけた
    if err.statusCode then alertify.error "Error: #{err.statusCode} #{err.statusMessage}"
    else alertify.error "Error: トークンに誤りがあります。\nもう一度確認してみてください。"


  do ->

    alertify.log "保存中 ......"

    Promise.all [scrapingMetaData(), getToken()]
    .then ([data, token]) -> save2Server data, token
    .then (data) -> displatySuccessResult()
    .catch (err) -> displatyFailedResult err
