$ ->

  class ChromeSyncStorageManager
    @get: (key) ->
      return new Promise (resolve, reject) ->
        chrome.storage.sync.get [key], (item) ->
          return reject undefined　if item[key] is undefined or item[key] is ''
          return resolve item[key]


  class HTMLMetaDataScraper
    constructor: (@data) ->

    getTitle: ->
      t1 = $('head title').text()
      t2 = $('meta[property="og:title"]').attr('content')
      return t1 or t2

    getSiteName: ->
      sn = $('meta[property="og:site_name"').text()
      return sn

    getSiteURL: ->
      su1 = $(location).attr('href')
      su2 = $('meta[property="og:url"]').attr('content')
      return su1 or su2

    getSiteImage: ->
      si = $('meta[property="og:image"]').attr('content')
      return si

    getHostName: ->
      hn = location.host
      return hn

    getType: ->
      isImage = @data?.type is 'image' or @data?.mediaType? && @data?.menuItemId is 'image'
      t = if isImage then 'image' else 'link'
      return t

    getURL: ->
      return @data.srcUrl if @getType() is 'image'

      siteURL = @getSiteURL()

      # デフォ値の設定
      $img = $('img')
      DEFUALT_URL = 'https://36.media.tumblr.com/9086462174c34becaf8b3e59de8f5800/tumblr_nzek2kWNNJ1ukgdjoo2_1280.jpg'

      if $img? and $img.length > 0 # bodyタグ内で一番最初の画像を引っ張ってくる
        console.log '画像ファイル発見', $img
        firstImgUrlInBody = $img.get(0).src
        # 存在しないなら初期値を設定する
        # (ex) Twitterだと、"$img.get(0) = <img class=​"avatar size32" alt>​"とかになる。srcがねえ。
        u = firstImgUrlInBody or DEFUALT_URL
      else # ページに画像が存在しない場合は灰色の画像を代わりに使用
        console.log '画像ファイルが見つからない。'
        u = DEFUALT_URL

      ###
      ここから例外処理(特別処理？)
      ###
      # 例外中の例外。もし、他のChromeExtensionがimgを挿入していた場合、urlにchrome-extension://から始まる画像ファイルが代入され、保存に失敗してしまう。
      if @data?.url?.indexOf("chrome-extension://") > -1
        console.log 'ChromeExnteionsファイルを画像に設定されてしまった。'
        u =  $img.get(1).src

      # ニコニコなら動画のサムネを指定
      if siteURL.indexOf("www.nicovideo.jp/watch/sm") > -1
        u = $('.videoThumbnailImage').attr('src')

      # XVIDEOSなら動画のサムネを指定
      if siteURL.indexOf("xvideos.com/video") > -1
        u = $('img.thumb').attr('src')

      return u

    getSiteDescription: ->
      d1 = $('meta[name="description"]').attr('content')
      d2 = $('meta[property="og:description"]').attr('content')
      return d1 or d2

    getFavicon: ->
      f = $('link[rel="shortcut icon"]').prop('href')
      return f

    get: ->
      title: @getTitle()
      siteName: @getSiteName()
      siteUrl: @getSiteURL()
      type: @getType()
      url: @getURL()
      hostName: @getHostName()
      description: @getSiteDescription()
      siteImage: @getSiteImage()
      favicon: @getFavicon()


  class KawpaaDataPoster

    # 開発用(Win)
    # DEST_URL: 'https://127.0.0.1:9021/api/posts'

    # 開発用(Vagrant)
    # DEST_URL: 'https://192.168.33.10:9021/api/posts'

    # 本番用(VPS)
    DEST_URL: 'https://kawpaa.eiurur.xyz/api/posts'

    constructor: (@data = {}) ->
      htmlMetaDataScraper = new HTMLMetaDataScraper(info)
      htmlMetaData = htmlMetaDataScraper.get()
      console.log htmlMetaData

      console.log 'before = ', @data
      @data.isPrivate = true
      @data.isArchive = false
      @data = $.extend true, htmlMetaData, @data
      console.log 'after = ', @data

    setToken: ->
      return new Promise (resolve, reject) =>
        ChromeSyncStorageManager.get('token')
        .then (token) =>
          @token = token
          return resolve @
        .catch (err) ->
          return reject err

    save2Server: ->
      return new Promise (resolve, reject) =>
          console.log 'save2Server = ', @DEST_URL
          console.log 'save2Server = ', @token
          console.log 'save2Server = ', @data
          $.ajax
            type: "POST"
            url: @DEST_URL
            data:
              token: @token
              post: @data
            headers:
              "Access-Control-Allow-Origin": "*"
          .done (data) ->
            console.log data
            # return reject data if data isnt 'ok' and data.statusCode isnt 200
            # return reject data if status isnt 200
            return resolve data
          .fail (err) ->
            return reject err


  class ResultAlerter

    # アイコンに色をつけて、完了したことをわかるようにする。通知もする。
    @displatySuccessResult: ->
      chrome.runtime.sendMessage({ "newIconPath" : 'build/images/blue/icon19.png' })
      alertify.success "保存しました。"

    @displatyFailedResult: (err) ->
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
    kawpaaDataPoster = new KawpaaDataPoster(info)
    kawpaaDataPoster.setToken()
    .then (_) -> kawpaaDataPoster.save2Server()
    .then (data) -> ResultAlerter.displatySuccessResult()
    .catch (err) -> ResultAlerter.displatyFailedResult err
