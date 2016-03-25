do ->


  SELECTOR_JS_STREAM_TWEET           = '.js-stream-tweet'
  SELECTOR_JS_TWEET_TEXT             = '.js-tweet-text'
  SELECTOR_PERMALINK_TWEET_CONTAINER = '.permalink-tweet-container'
  SELECTOR_JS_ADAPTIVE_PHOTO         = '.js-adaptive-photo'
  SELECTOR_JS_PERMALINK              = '.js-permalink'
  SELECTOR_JS_ACTION_PROFILE_NAME    = '.js-action-profile-name'
  SELECTOR_ACTION_KAWPAA_CONTAINER   = '.action-kawpaa-container'

  showKawpaaButton = (_$) ->
    existKawpaaButton = _$.find(SELECTOR_ACTION_KAWPAA_CONTAINER).length isnt 0
    hasPhoto = _$.find(SELECTOR_JS_ADAPTIVE_PHOTO).length > 0

    return if existKawpaaButton
    return unless hasPhoto

    html = """
      <div class="ProfileTweet-action action-kawpaa-container" style="display: inline-block; width: 26px;">
        <a class="js-tooltip kawpaa-save-link" href="#" data-original-title="Save to Kawpaa" style="display: inline-block; float: left;">
          <span class="icon icon-kawpaa" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(#{DATA_URL_GRAY_16});">a</span>
        </a>
      </div>
    """
    _$.find('.ProfileTweet-actionList').append html


  # removeKawpaaButton = (_$) ->
  #   existKawpaaButton = _$.find(SELECTOR_ACTION_KAWPAA_CONTAINER).length isnt 0
  #   return unless existKawpaaButton
  #   _$.find(SELECTOR_ACTION_KAWPAA_CONTAINER).remove()


  sendBackground = (params) ->
    console.log params
    chrome.runtime.sendMessage params, (response) ->
      console.log response



  # Individual tweet page
  $(document).on
    'mouseenter': (e) -> showKawpaaButton($(this))
  , SELECTOR_PERMALINK_TWEET_CONTAINER


  # Home timeline
  $(document).on
    'mouseenter': (e) -> showKawpaaButton($(this))
  , SELECTOR_JS_STREAM_TWEET


  # Click
  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()

    # 画像の差し替え
    $(this).find('.icon-kawpaa').css('background-image', "url(#{DATA_URL_BLUE_16})")

    $jsStreamTweet = $(this).closest(SELECTOR_JS_STREAM_TWEET)
    $permalinkTweetContaner = $(this).closest(SELECTOR_PERMALINK_TWEET_CONTAINER)

    # Hack: 拡張性なし
    nowPageVariable = if $jsStreamTweet.length > 0 then 'homeTImeline'

    switch nowPageVariable
      when 'homeTImeline'
        _targetElement = $jsStreamTweet
      else # 個別ツイートページ
        _targetElement = $permalinkTweetContaner

    tweetUrl = _targetElement.find(SELECTOR_JS_PERMALINK).attr('href')
    title = "#{_targetElement.find(SELECTOR_JS_ACTION_PROFILE_NAME).text()} / #{_targetElement.find(SELECTOR_JS_TWEET_TEXT).text()}"
    imageUrl = _targetElement.find(SELECTOR_JS_ADAPTIVE_PHOTO).attr('data-image-url')

    # 複数枚のときは今見ている画像を保存する。
    imageUrl = $('.media-image').first().attr('src') or imageUrl
    imageUrl = imageUrl.replace(':large', '')
    console.log imageUrl

    params =
      name: 'twitter'
      info:
        siteUrl: "https://twitter.com#{tweetUrl}"
        type: 'image'
        srcUrl: "#{imageUrl}:orig"
        title: title
    console.log 'Twitter params = ', params
      # TODO: linkにも対応。
      # info:
      #   url: "https://twitter.com#{tweetUrl}"
      #   type: 'link'
      #   siteImage: "#{imageUrl}:orig"
    sendBackground(params)

    # 複数枚画像に対応ver
    # FIX: 同時に違うパラメータをBackgroundに渡すのはいいのだけど、ページ上のデータをスクレイピングしてサーバに送信する実行するスクリプト(content.js)で上書きされてしまう。
    # _targetElement.find(SELECTOR_JS_ADAPTIVE_PHOTO).each ->
    #   # sendBackground(getParamsToServer(tweetUrl, $(this).attr('data-image-url'), title))
    #   # _this = $(this)
    #   # console.log this
    #   console.log $(this).attr('data-image-url')
    #   imageUrl = $(this).attr('data-image-url')
    #   params =
    #     name: 'twitter'
    #     info:
    #       siteUrl: "https://twitter.com#{tweetUrl}"
    #       type: 'image'
    #       srcUrl: "#{imageUrl}:orig"
    #       title: title
    #   sendBackground(params)



  DATA_URL_GRAY_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYByssdLYJhQAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAACenp4AYmJiAJ6engQAAABOAAAAKAAAAAAAAADYAAAAsWJiYv2enp4AYmJiAAAAAAAAAAAAAQAAAAAAAAAAnp6eAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+YmJiAAAAAAABAAAAAJ6engAAAAAXAAAA4wAAAIRiYmKCAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/AAAAewAAABwAAADqYmJiAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAgAAAD+AAAAAACenp6gnp6efgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/np6enwAAAAABnp6eBAAAAPtiYmIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp7/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAAJ6enp+enp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6enoCenp6eAAAAAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAcAAAD/AmJiYgAAAAD+AAAAHQAAALyenp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnp6egAAAALsAAAAcAAAA/2JiYgABAAAAAAAAAACenp4AAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP9iYmIAAAAAAAIAAAAAAAAAAGJiYgAAAAD+YmJiYQAAAAQAAACdAAAA9AAAAPQAAACdAAAABGJiYmIAAAD/YmJiAAAAAAAAAAAA4IxvG+IdfVgAAAAASUVORK5CYII="

  DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII="
