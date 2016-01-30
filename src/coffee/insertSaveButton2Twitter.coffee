do ->

  showKawpaaButton = (_$) ->
    hasPhoto = _$.find('.js-adaptive-photo').length > 0
    existKawpaaButton = _$.find('.action-kawpaa-container').length isnt 0

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


  removeKawpaaButton = (_$) ->
    existKawpaaButton = _$.find('.action-kawpaa-container').length isnt 0

    return unless existKawpaaButton

    _$.find('.action-kawpaa-container').remove()

  sendBackground = (params) ->
    console.log params
    chrome.runtime.sendMessage params, (response) ->
      console.log response

  class Twitter

    @SELECTOR_JS_STREAM_TWEET = '.js-stream-tweet'
    @SELECTOR_JS_TWEET_TEXT = '.js-tweet-text'
    @SELECTOR_PERMALINK_TWEET_CONTAINER = '.permalink-tweet-container'

    constructor: ->
      @qJsStreamTweet = $(this).closest(Twitter.SELECTOR_JS_STREAM_TWEET)
      @qPermalinkTweetContaner = $(this).closest(Twitter.SELECTOR_PERMALINK_TWEET_CONTAINER)

    bindEvent: ->

      # Individual tweet page
      $(document).on
        'mouseenter': (e) -> showKawpaaButton($(this))
      , SELECTOR_PERMALINK_TWEET_CONTAINER

      # Home timeline
      $(document).on
        'mouseenter': (e) -> showKawpaaButton($(this))
      , SELECTOR_JS_STREAM_TWEET

      # Click
      $(document).on 'click', SELECTOR_KAWPAA_SAVE_LINK, (e) ->
        e.preventDefault()

  SELECTOR_JS_STREAM_TWEET = '.js-stream-tweet'
  SELECTOR_JS_TWEET_TEXT = '.js-tweet-text'
  SELECTOR_PERMALINK_TWEET_CONTAINER = '.permalink-tweet-container'


  ###
  Individual tweet page
  ###
  $(document).on
    'mouseenter': (e) -> showKawpaaButton($(this))
    # 'mouseleave': (e) -> removeKawpaaButton($(this))
  , SELECTOR_PERMALINK_TWEET_CONTAINER


  ###
  Home timeline
  ###
  $(document).on
    'mouseenter': (e) -> showKawpaaButton($(this))
    # 'mouseleave': (e) -> removeKawpaaButton($(this))
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

    tweetUrl = _targetElement.find('.js-permalink').attr('href')
    imageUrl = _targetElement.find('.js-adaptive-photo').attr('data-image-url')
    title = "#{_targetElement.find('.js-action-profile-name').text()} / #{_targetElement.find(SELECTOR_JS_TWEET_TEXT).text()}"


    params =
      name: 'twitter'
      info:
        siteUrl: "https://twitter.com#{tweetUrl}"
        type: 'image'
        srcUrl: "#{imageUrl}:orig"
        title: title
      # TODO: linkにも対応。
      # info:
      #   url: "https://twitter.com#{tweetUrl}"
      #   type: 'link'
      #   siteImage: "#{imageUrl}:orig"

    sendBackground(params)



  DATA_URL_GRAY_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYByssdLYJhQAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAACenp4AYmJiAJ6engQAAABOAAAAKAAAAAAAAADYAAAAsWJiYv2enp4AYmJiAAAAAAAAAAAAAQAAAAAAAAAAnp6eAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+YmJiAAAAAAABAAAAAJ6engAAAAAXAAAA4wAAAIRiYmKCAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/AAAAewAAABwAAADqYmJiAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAgAAAD+AAAAAACenp6gnp6efgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/np6enwAAAAABnp6eBAAAAPtiYmIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp7/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAAJ6enp+enp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6enoCenp6eAAAAAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAcAAAD/AmJiYgAAAAD+AAAAHQAAALyenp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnp6egAAAALsAAAAcAAAA/2JiYgABAAAAAAAAAACenp4AAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP9iYmIAAAAAAAIAAAAAAAAAAGJiYgAAAAD+YmJiYQAAAAQAAACdAAAA9AAAAPQAAACdAAAABGJiYmIAAAD/YmJiAAAAAAAAAAAA4IxvG+IdfVgAAAAASUVORK5CYII="

  DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII="
