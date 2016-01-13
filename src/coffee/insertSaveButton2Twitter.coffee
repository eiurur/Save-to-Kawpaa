do ->
  DATA_URL_GRAY_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYByssdLYJhQAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAACenp4AYmJiAJ6engQAAABOAAAAKAAAAAAAAADYAAAAsWJiYv2enp4AYmJiAAAAAAAAAAAAAQAAAAAAAAAAnp6eAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+YmJiAAAAAAABAAAAAJ6engAAAAAXAAAA4wAAAIRiYmKCAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/AAAAewAAABwAAADqYmJiAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAgAAAD+AAAAAACenp6gnp6efgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/np6enwAAAAABnp6eBAAAAPtiYmIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp7/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAAJ6enp+enp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6enoCenp6eAAAAAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAcAAAD/AmJiYgAAAAD+AAAAHQAAALyenp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnp6egAAAALsAAAAcAAAA/2JiYgABAAAAAAAAAACenp4AAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP9iYmIAAAAAAAIAAAAAAAAAAGJiYgAAAAD+YmJiYQAAAAQAAACdAAAA9AAAAPQAAACdAAAABGJiYmIAAAD/YmJiAAAAAAAAAAAA4IxvG+IdfVgAAAAASUVORK5CYII="

  DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII="

  # TODO: ページが読み込まれたらボタンを挿入
  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()
    console.log 'Kawpaa'
    # 画像の差し替え
    $(this).find('.icon-kawpaa').css('background-image', "url(#{DATA_URL_BLUE_16})")

    # TODO: メタデータの取得
    tweetUrl = $(this).closest('.js-stream-tweet').find('.js-permalink').attr('href')
    imageUrl = $(this).closest('.js-stream-tweet').find('.js-adaptive-photo').attr('data-image-url')

    params =
      name: 'twitter'
      info:
        siteUrl: "https://twitter.com#{tweetUrl}"
        type: 'image'
        srcUrl: "#{imageUrl}:orig"
      # info:
      #   url: "https://twitter.com#{tweetUrl}"
      #   type: 'link'
      #   siteImage: "#{imageUrl}:orig"

    console.log params

    chrome.runtime.sendMessage params, (response) ->
      console.log response

    # TODO: トークンの取得

    # TODO: サーバにポスト

  $(document).on 'mouseenter', '.js-stream-tweet', (e) ->
    # TODO: ツイートにリンクが含まれているかチェック

    # console.log 'Enter!!'
    # console.log $(this).find('.action-kawpaa-container')
    # console.log $(this).find('.action-kawpaa-container').length
    # console.log $(this).find('.ProfileTweet-actionList .action-kawpaa-container')

    hasPhoto = $(this).find('.js-adaptive-photo').length > 0
    existKawpaaButton = $(this).find('.action-kawpaa-container').length isnt 0
    # console.log 'existKawpaaButton = ', existKawpaaButton
    # console.log 'hasPhoto = ', hasPhoto
    return if existKawpaaButton
    return unless hasPhoto
    html = """
      <div class="ProfileTweet-action action-kawpaa-container" style="display: inline-block; width: 26px;">
        <a class="js-tooltip kawpaa-save-link" href="#" data-original-title="Save to Kawpaa" style="display: inline-block; float: left;">
          <span class="icon icon-kawpaa" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(#{DATA_URL_GRAY_16});">a</span>
        </a>
      </div>
    """
    $(this).find('.ProfileTweet-actionList').append html

  $(document).on 'mouseleave', '.js-stream-tweet', (e) ->
    # console.log 'Laeve!!'
    existKawpaaButton = $(this).find('.action-kawpaa-container').length is 0
    return unless existKawpaaButton
    $(this).find('.action-kawpaa-container').remove()


  # INTERVAL_TIME_MS = 3 * 1000
  # checkExistanceSaveButton = ->
  #   $('#timeline .ProfileTweet-actionList').each (index) ->
  #     console.log $(this).find('.action-kawpaa-container')
  #     unless $(this).find('.action-kawpaa-container')
  #       console.log $(this)
  #       html = """
  #         <div class="ProfileTweet-action action-kawpaa-container">
  #           <a class="js-tooltip" href="#" data-original-title="Save to Kawpaa">
  #             <span class="icon icon-kawpaa">a</span>
  #           </a>
  #         </div>
  #       """
  #       $(this).append html
  #       return
  #     console.log '存在する'


  # $(document).ready ->
  #   console.log 'Ready!!'
    # setInterval checkExistanceSaveButton, INTERVAL_TIME_MS

  # TODO: 挿入したボタンにイベントハンドル

  # TODO: 挿入したボタンが押下されたら、Twitter専用のメタデータ収集処理とtokenの取得をする

  # TODO: サーバに投げて、結果をAlertifyする
    # MutationObserver = window.MutationObserver || window.WebKitMutationObserver

    # # target = $('#timeline')
    # # target = document.querySelector('#timeline')
    # target = document.querySelector('.js-stream-tweet')
    # console.log target
    # opts =
    #   childList: true
    #   subtree: false
    #   attributes: false
    #   characterData: false

    # observer = new MutationObserver (mutations) ->
    #   console.log 'Omega'
    #   mutations.forEach (mutation) ->
    #     console.log mutation
    # observer.observe target, opts
    # return

