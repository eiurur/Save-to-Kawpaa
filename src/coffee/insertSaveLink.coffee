do ->

  # todo: 共通化したい
  DANBOORU_HOSTNAME       = 'danbooru.donmai.us'
  DEVIANTART_HOSTNAME     = 'deviantart.com'
  GELBOORU_HOSTNAME       = 'gelbooru.com'
  KONACHAN_HOSTNAME       = 'konachan.com'
  PIXIV_HOSTNAME          = 'www.pixiv.net'
  SANKAKUCOMPLEX_HOSTNAME = 'chan.sankakucomplex.com'
  YANDE_RE_HOSTNAME       = 'yande.re'

  DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII="


  getSelectorInsertionTagetOfKawpaaLink = ->
    result = null
    hostname = location.host
    console.log hostname
    switch hostname
      when DANBOORU_HOSTNAME
        result = '#post-sections'
      when GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, YANDE_RE_HOSTNAME
        result = '#right-col h4'
      when PIXIV_HOSTNAME
        result = '.bookmark-container'
      when SANKAKUCOMPLEX_HOSTNAME
        result = '#share'
      else
        result = '.dev-meta-actions' if hostname.indexOf(DEVIANTART_HOSTNAME) isnt -1

    return result

  getHtmlToInsert = ->
    result = null
    hostname = location.host
    switch hostname
      when DANBOORU_HOSTNAME
        result = """
          <li><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></li>
        """
      when GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, YANDE_RE_HOSTNAME
        result = """
           |
          <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
        """
      when PIXIV_HOSTNAME
        result = """
          <a href="#" class="add-bookmark _button kawpaa-save-link">Save to Kawpaa</a>
        """
      when SANKAKUCOMPLEX_HOSTNAME
        result = """
          <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
        """
      else
        if hostname.indexOf(DEVIANTART_HOSTNAME) isnt -1
          result = """
            <a class="dev-page-button dev-page-button-with-text dev-page-download kawpaa-save-link" href="#" data-download_url="http://www.deviantart.com/download/460347620/gochiusa_by_azizkeybackspace-d7m2uhw.png?token=a6e80ce8b02c8c1dc7762417c29bf3d3b57bd13d&amp;ts=1458132778">
             <i style="background: url(#{DATA_URL_BLUE_16}); background-position: none; background-repeat: no-repeat;"></i>
             <span class="label">Save to Kawpaa</span>
            </a>
          """
    return result


  showKawpaaLink = ->
    selector = getSelectorInsertionTagetOfKawpaaLink()
    html = getHtmlToInsert()
    $(document).find(selector).append html


  sendBackground = (params) ->
    console.log params
    chrome.runtime.sendMessage params, (response) ->
      console.log response

  getParamsToServer = ->
    return new Promise (resolve, reject) ->
      result = info: type: 'image'
      hostname = location.host
      switch hostname
        when DANBOORU_HOSTNAME
          # 画像のFQDN
          #   => https://danbooru.donmai.us/data/sample/sample-2a7955046380f0aaa95d83f1a4c4bd14.jpg
          #
          # 縮小後のURL ===  $('#image').attr('src') で得られる画像のURL
          #   => /data/sample/sample-2a7955046380f0aaa95d83f1a4c4bd14.jpg
          #
          # 原寸大のURL
          #   => /data/2a7955046380f0aaa95d83f1a4c4bd14.jpg
          sampleImgUrl = $('#image').attr('src')
          originalImageSrc = sampleImgUrl.replace 'sample/sample-', ''
          srcUrl = "https://danbooru.donmai.us#{originalImageSrc}"
          result.name = DANBOORU_HOSTNAME
          result.info.srcUrl = srcUrl
          return resolve result
        when GELBOORU_HOSTNAME
          originalImageSrc = $('#image').attr('src')
          srcUrl = originalImageSrc
          result.name = GELBOORU_HOSTNAME
          result.info.srcUrl = srcUrl
          return resolve result
        when KONACHAN_HOSTNAME
          # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
          originalImageSrc = $('#image').attr('src')
          srcUrl = originalImageSrc
          result.name = KONACHAN_HOSTNAME
          result.info.srcUrl = srcUrl
          return resolve result
        when PIXIV_HOSTNAME
          originalImageSrc = $('.original-image').data('src')
          srcUrl = originalImageSrc
          result.name = PIXIV_HOSTNAME
          result.info.srcUrl = srcUrl
          return resolve result
        when SANKAKUCOMPLEX_HOSTNAME
          # 画像のFQDN
          #   => https://cs.sankakucomplex.com/data/34/38/34381c7e1c53bc1929f68b491fb5c0c8.png?4767698
          #
          # 縮小後のURL ===  $('#image').attr('src') で得られる画像のURL
          #   => //cs.sankakucomplex.com/data/sample/34/38/sample-34381c7e1c53bc1929f68b491fb5c0c8.jpg?4767698
          # 原寸大のURL
          #   => https://cs.sankakucomplex.com/data/34/38/34381c7e1c53bc1929f68b491fb5c0c8.png?4767698

          # 縮小時の画像URLと原寸大の画像URLの拡張子が異なる場合があり、
          # その場合は置換のしようがないため、クリックして原寸大のURLを取得する方法を使用した
          $('#image').on 'click', (e) ->
            originalImageSrc = $('#image').attr('src')
            srcUrl = "https:#{originalImageSrc}"
            result.name = SANKAKUCOMPLEX_HOSTNAME
            result.info.srcUrl = srcUrl
            return resolve result
          $('#image').click()
        when YANDE_RE_HOSTNAME
          # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
          originalImageSrc = $('#image').attr('src')
          srcUrl = originalImageSrc
          result.name = YANDE_RE_HOSTNAME
          result.info.srcUrl = srcUrl
          return resolve result
        else
          if hostname.indexOf(DEVIANTART_HOSTNAME) isnt -1
            sampleImgUrl = $('.dev-content-full').attr('src')
            srcUrl = sampleImgUrl
            result.name = DEVIANTART_HOSTNAME
            result.info.srcUrl = srcUrl
            return resolve result
      return

  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()
    getParamsToServer().then (params) -> sendBackground(params)


  do showKawpaaLink
