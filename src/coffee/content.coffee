$ ->

  class ChromeSyncStorageManager
    @get: (key) ->
      return new Promise (resolve, reject) ->
        chrome.storage.sync.get [key], (item) ->
          return reject undefined　if item[key] is undefined or item[key] is ''
          return resolve item[key]


  class HTMLMetaDataScraper
    constructor: (@data) ->

    removeHrefInATag: (html) ->
      TAG_REGEX = /href=".*"/gi
      return html.replace(TAG_REGEX, '');

    removeTag: (tagName, html) ->
      TAG_REGEX = new RegExp("<#{tagName}\\b[^<]*(?:(?!<\\/#{tagName}>)<[^<]*)*<\\/#{tagName}>", 'gi')
      while (TAG_REGEX.test(html))
        html = html.replace(TAG_REGEX, "")
      return html

    # あとで消す？
    removeScriptTag: (html) ->
      SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
      while (SCRIPT_REGEX.test(html))
        html = html.replace(SCRIPT_REGEX, "")
      return html

    searchIframeSrc: ->
      return $('iframe')?.src

    # getIframe

    ###
    linkなら本文や、動画の埋め込みリンク
    imageならnull
    ###
    getContent: ->

      return null if @getType() is 'image'

      content = null

      # youtube
      if location.href.indexOf("www.youtube.com/watch?v=") > -1
        vNumber = location.search.split('&').shift().split('=').pop()
        console.log 'vNumber = ', vNumber
        content = """
          <iframe width="560" height="315" src="https://www.youtube.com/embed/#{vNumber}" frameborder="0" allowfullscreen></iframe>
        """

      # ニコニコなら動画のサムネを指定
      # # ニコニコはhttpsに対応していないのでiframeがブロックされます。どうしようもないので待ちましょう。
      else if location.href.indexOf("www.nicovideo.jp/watch/sm") > -1
        title = document.title
        smNumber =  location.href.split('/').pop()
        console.log 'title = ', title
        console.log 'smNumber = ', smNumber
        content = """
          <iframe width="312" height="176" src="//ext.nicovideo.jp/thumb/#{smNumber}" scrolling="no" style="border:solid 1px #CCC;" frameborder="0"><a href="//www.nicovideo.jp/watch/#{smNumber}">#{title}</a></iframe>
        """

      # 2ch
      else if location.href.indexOf("bbspink.com") > -1 || location.href.indexOf("2ch.net") > -1
        content = @removeScriptTag　$('.thread').html()

      # ふたば
      else if location.href.indexOf("2chan.net") > -1
        content = @removeScriptTag　$('.thre').html()

      # Just for me
      else if location.href.indexOf("mannanoeroetaiken.blog.fc2.com") > -1
        content = @removeTag('iframe', @removeHrefInATag(@removeScriptTag($('.content').html())))

      else
        # iframe_src = @searchIframeSrc()
        # if iframe_src

        content = @removeScriptTag　$('section').html()
        console.log content

      return content


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

      # youtube
      # TODO: 別の動画に移動しても$('meta[property="og:image"]').attr('content')に変化なし。分からん。
      if siteURL.indexOf("www.youtube.com/watch?v=") > -1
        u = $('meta[property="og:image"]')?.attr('content')

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
      content: @getContent()
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

    constructor: (@data = {}) ->
      htmlMetaDataScraper = new HTMLMetaDataScraper(info)
      htmlMetaData = htmlMetaDataScraper.get()
      console.log htmlMetaData

      CHROME_RUNTIME_ID = 'dghanpofbgihidnoofloojkpbkgjkfgg'
      isProduction = chrome.runtime.id is CHROME_RUNTIME_ID
      @DEST_URL = if isProduction then 'https://kawpaa.eiurur.xyz/api/posts' else 'https://127.0.0.1:9021/api/posts'

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
