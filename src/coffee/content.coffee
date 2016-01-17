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
      data.title = title1 or title2

      # サイトの名前 (ex) Twitter
      siteName = $('meta[property="og:site_name"').text()
      data.siteName = siteName

      # サイトURL (ex) 'https://twitter.com/haruyuki_nijyou/status/687040101721874432'
      siteUrl1 = $(location).attr('href')
      siteUrl2 = $('meta[property="og:url"]').attr('content')
      data.siteUrl = info.siteUrl or siteUrl1 or siteUrl2

      console.log 'info =  ', info
      console.log 'info.type =  ', info.type
      console.log 'info?.type? =  ', info?.type?
      console.log 'info?.type? is image =  ', info?.type? is 'image'

      # TODO: linkならページ先のURLに対してスクレイピングを行う。

      # URL と type
      # Twitterで画像または、コンテキストメニューから、かつ画像なら image そうでないなら link
      if info.type is 'image' or info?.mediaType? && info.menuItemId is 'image' # image
        data.type = 'image'
        data.url = info.srcUrl
      # else if info?.mediaType? && info.menuItemId is 'video' # video
      #   data.url = info.srcUrl
      #   data.type = 'video'
      else  # page
        data.type = 'link'
        $img = $('img')
        if $img? and $img.length > 0 # bodyタグ内で一番最初の画像を引っ張ってくる
          console.log '画像ファイル発見', $img
          firstImgUrlInBody = $img.get(0).src
          data.url = firstImgUrlInBody
        else # ページに画像が存在しない場合は灰色の画像を代わりに使用
          console.log '画像ファイルが見つからない。'
          data.url = 'https://36.media.tumblr.com/9086462174c34becaf8b3e59de8f5800/tumblr_nzek2kWNNJ1ukgdjoo2_1280.jpg'
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

      # 説明 (ex) “中学生大家さん”
      description1 = $('meta[name="description"]').attr('content')
      description2 = $('meta[property="og:description"]').attr('content')
      data.description = description1 or description2

      # 画像 (ex) 'https://pbs.twimg.com/media/CYjbVOCVAAAEegD.png:large'
      siteImage = $('meta[property="og:image"]').attr('content')
      data.siteImage = siteImage

      # favixon
      favicon = $('link[rel="shortcut icon"]').prop('href')
      data.favicon = favicon

      # MongooseのDefaultが動作しないので、初期値を手動で設定
      data.isPrivate = true
      data.isArchive = false

      console.log data

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
