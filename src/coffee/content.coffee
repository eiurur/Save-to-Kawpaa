$ ->

  save2Server = (data, token) ->
    return new Promise (resolve, reject) ->

      # 開発用(Win)
      # destUrl = 'https://127.0.0.1:9021/api/posts'

      # 開発用(Vagrant)
      # destUrl = 'https://192.168.33.10:9021/api/posts'

      # 本番用(VPS)
      # destUrl = 'https://tk2-207-13331.vs.sakura.ne.jp:9021/api/posts'
      destUrl = 'https://kawpaa.eiurur.xyz/api/posts'

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

      # タイトル (ex) '(1) Twitter'
      title1 = $('head title').text()
      title2 = $('meta[property="og:title"]').attr('content')
      data.title = info?.title or title1 or title2

      # サイトの名前 (ex) Twitter
      siteName = $('meta[property="og:site_name"').text()
      data.siteName = siteName

      # サイトURL (ex) 'https://twitter.com/haruyuki_nijyou/status/687040101721874432'
      siteUrl1 = $(location).attr('href')
      siteUrl2 = $('meta[property="og:url"]').attr('content')
      data.siteUrl = info?.siteUrl or siteUrl1 or siteUrl2

      console.log 'info =  ', info
      console.log 'info?.type =  ', info?.type
      console.log 'info?.type? =  ', info?.type?
      console.log 'info?.type? is image =  ', info?.type? is 'image'

      # TODO: linkならページ先のURLに対してスクレイピングを行う。

      # URL と type
      # Twitterで画像または、コンテキストメニューから、かつ画像なら image そうでないなら link
      if info?.type is 'image' or info?.mediaType? && info?.menuItemId is 'image' # image
        data.type = 'image'
        data.url = info.srcUrl
      # TODO:
      # else if info?.mediaType? && info.menuItemId is 'video' # video
      #   data.url = info.srcUrl
      #   data.type = 'video'
      else  # page

        # デフォ値の設定
        data.type = 'link'
        $img = $('img')
        DEFUALT_URL = 'https://36.media.tumblr.com/9086462174c34becaf8b3e59de8f5800/tumblr_nzek2kWNNJ1ukgdjoo2_1280.jpg'
        if $img? and $img.length > 0 # bodyタグ内で一番最初の画像を引っ張ってくる
          console.log '画像ファイル発見', $img
          firstImgUrlInBody = $img.get(0).src
          # Twitterだと、"$img.get(0) = <img class=​"avatar size32" alt>​"とかになる。
          # 例外対策にデフォ値を設定
          data.url = firstImgUrlInBody or DEFUALT_URL
        else # ページに画像が存在しない場合は灰色の画像を代わりに使用
          console.log '画像ファイルが見つからない。'
          data.url = DEFUALT_URL
        # ここから例外処理(特別処理？)
        if data.url.indexOf("chrome-extension://") > -1 #例外中の例外。もし、他のChromeExtensionがimgを挿入していた場合、urlにchrome-extension://から始まる画像ファイルが代入され、保存に失敗してしまう。
          console.log 'ChromeExnteionsファイルを画像に設定されてしまった。'
          data.url =  $img.get(1).src

        # ニコニコなら動画のサムネを指定
        if siteUrl1.indexOf("www.nicovideo.jp/watch/sm") > -1
          data.url = $('.videoThumbnailImage').attr('src')

        # XVIDEOSなら動画のサムネを指定
        if siteUrl1.indexOf("xvideos.com/video") > -1
          data.url = $('img.thumb').attr('src')


      # ホスト名 (ex) 'twitter.com'
      hostName = location.host
      data.hostName = hostName

      # サイトの説明 (ex) “中学生大家さん”
      description1 = $('meta[name="description"]').attr('content')
      description2 = $('meta[property="og:description"]').attr('content')
      data.description = description1 or description2

      # サイトの画像 (ex) 'https://pbs.twimg.com/media/CYjbVOCVAAAEegD.png:large'
      siteImage = $('meta[property="og:image"]').attr('content')
      data.siteImage = siteImage

      # サイトのfavixon
      favicon = $('link[rel="shortcut icon"]').prop('href')
      data.favicon = favicon

      # MongooseのDefaultが動作しないので、初期値を手動で設定
      data.isPrivate = true
      data.isArchive = false

      # pixivならusernameとpasswordが必要なので一緒に渡す。
      data.pixiv =
        username: info.pixiv_username
        password: info.pixiv_password

      console.log data

      return resolve data

  # アイコンに色をつけて、完了したことをわかるようにする。通知もする。
  displatySuccessResult = ->
    chrome.runtime.sendMessage({ "newIconPath" : 'build/images/blue/icon19.png' })
    alertify.success "保存しました。"

  displatyFailedResult = (err) ->
    console.log 'displatyFailedResult err = ', err

    # res.status(err.statusCode).json statusCode: err.statusCode, message: err.messageのとき
    if err.responseJSON?
      err.statusCode = err.responseJSON.statusCode
      err.statusMessage = err.responseJSON.message
    else if err.status? # Ajaxに失敗したとき
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
