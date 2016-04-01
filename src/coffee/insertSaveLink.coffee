do ->

  DANBOORU_HOSTNAME       = 'danbooru.donmai.us'
  DEVIANTART_HOSTNAME     = 'deviantart.com'
  GELBOORU_HOSTNAME       = 'gelbooru.com'
  KONACHAN_HOSTNAME       = 'konachan.com'
  PIXIV_HOSTNAME          = 'www.pixiv.net'
  SANKAKUCOMPLEX_HOSTNAME = 'chan.sankakucomplex.com'
  YANDE_RE_HOSTNAME       = 'yande.re'

  PIXIV_MANGA_URL         = 'http://www.pixiv.net/member_illust.php?mode=manga'

  DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII="


  # 以下のコードを全て外部化したい
  class KawpaaLinkInserter
    constructor: (@hostname) ->
      @selector = null
      @html = null

    insert: ->
      $(document).find(@selector).append @html

    getParamsToServer: ->

    bindClickEvent: ->
      $(document).on 'click', '.kawpaa-save-link', (e) =>
        e.preventDefault()
        @getParamsToServer().then (params) => @sendBackground(params)

    sendBackground:  (params) ->
      chrome.runtime.sendMessage params, (response) -> console.log response


  class DanbooruKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(DANBOORU_HOSTNAME)
      @selector = '#post-sections'
      @html = """
        <li><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></li>
      """

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        imgUrl = $('#image-resize-link').attr('href') or $('#image').attr('src')
        originalImageSrc = imgUrl.replace 'sample/sample-', ''
        srcUrl = "https://danbooru.donmai.us#{originalImageSrc}"
        params.name = DANBOORU_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params


  class GelbooruKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(GELBOORU_HOSTNAME)
      @selector = '#right-col h4'
      @html = """
         |
        <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
      """

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        originalImageSrc = $('#image').attr('src')
        srcUrl = originalImageSrc
        params.name = GELBOORU_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params


  class KonachanKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(KONACHAN_HOSTNAME)
      @selector = '#right-col h4'
      @html = """
         |
        <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
      """

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
        originalImageSrc = $('#image').attr('src')
        srcUrl = originalImageSrc
        params.name = KONACHAN_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params


  class PixivKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(PIXIV_HOSTNAME)
      @selector = '.bookmark-container'
      @html = """
        <a href="#" class="add-bookmark _button kawpaa-save-link">Save to Kawpaa</a>
      """

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        originalImageSrc = $('.original-image').data('src')
        srcUrl = originalImageSrc
        params.name = PIXIV_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params

  class PixivKawpaaMultipleLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(PIXIV_HOSTNAME)
      @selector = '.item-container'
      @html = """
        <div style="font-size: 2em;">
          <a href="#" class="kawpaa-save-link">Save to Kawpaa</a>
        </div>
      """

    bindClickEvent: ->
      _this = @
      $(document).on 'click', '.kawpaa-save-link', (e) ->
        e.preventDefault()
        _this.getParamsToServer($(this)).then (params) -> _this.sendBackground(params)

    getParamsToServer: (_$) ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        srcUrl = _$.closest('.item-container').find('.image').data('src')
        params.name = PIXIV_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params


  class SankakuComplexKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(SANKAKUCOMPLEX_HOSTNAME)
      @selector = '#share'
      @html = """
        <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
      """

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        $('#image').on 'click', (e) ->
          originalImageSrc = $('#image').attr('src')
          srcUrl = "https:#{originalImageSrc}"
          params.name = SANKAKUCOMPLEX_HOSTNAME
          params.info.srcUrl = srcUrl
          return resolve params
        $('#image').click()


  class YandereKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(YANDE_RE_HOSTNAME)
      @selector = '#right-col h4'
      @html = """
         |
        <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
      """

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
        originalImageSrc = $('#image').attr('src')
        srcUrl = originalImageSrc
        params.name = YANDE_RE_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params


  class DeviantArtKawpaaLinkInserter extends KawpaaLinkInserter
    constructor: ->
      super(DEVIANTART_HOSTNAME)
      @selector = '.dev-meta-actions'
      @html = """
        <a class="dev-page-button dev-page-button-with-text dev-page-download kawpaa-save-link" href="#" data-download_url="http://www.deviantart.com/download/460347620/gochiusa_by_azizkeybackspace-d7m2uhw.png?token=a6e80ce8b02c8c1dc7762417c29bf3d3b57bd13d&amp;ts=1458132778">
         <i style="background: url(#{DATA_URL_BLUE_16}); background-position: none; background-repeat: no-repeat;"></i>
         <span class="label">Save to Kawpaa</span>
        </a>
      """
      do @onChangeURL

    onChangeURL: ->
      $(document).on 'change', 'data-deviationid', =>
        sampleImgUrl = $(this).attr('src')
        console.log 'sampleImgUrl = ', sampleImgUrl

    getParamsToServer: ->
      return new Promise (resolve, reject) =>
        params = info: type: 'image'
        sampleImgUrl = $('.dev-content-full').attr('src')
        srcUrl = sampleImgUrl
        params.name = DEVIANTART_HOSTNAME
        params.info.srcUrl = srcUrl
        return resolve params


  getSaveTokawpaaLinkInserter = ->
    hostname = location.host
    href     = location.href
    console.log hostname
    console.log href

    if href.indexOf(PIXIV_MANGA_URL) isnt -1 then return new PixivKawpaaMultipleLinkInserter()

    switch hostname
      when DANBOORU_HOSTNAME then return new DanbooruKawpaaLinkInserter()
      when GELBOORU_HOSTNAME then return new GelbooruKawpaaLinkInserter()
      when KONACHAN_HOSTNAME then return new KonachanKawpaaLinkInserter()
      when PIXIV_HOSTNAME then return new PixivKawpaaLinkInserter()
      when SANKAKUCOMPLEX_HOSTNAME then return new SankakuComplexKawpaaLinkInserter()
      when YANDE_RE_HOSTNAME then return new YandereKawpaaLinkInserter()
      else
        # DevianArtは個人ページをサブドメインで管理する方法をとっているので判定方法をちょっと変える
        if hostname.indexOf(DEVIANTART_HOSTNAME) isnt -1 then return new DeviantArtKawpaaLinkInserter()

  saveToKawpaaLinkInserter = getSaveTokawpaaLinkInserter()
  saveToKawpaaLinkInserter.insert()
  saveToKawpaaLinkInserter.bindClickEvent()
