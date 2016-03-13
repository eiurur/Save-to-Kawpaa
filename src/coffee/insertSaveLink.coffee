do ->

  SELECTOR_INSERTION_TARGET_OF_KAWPAA_LINK = '#right-col h4'

  showKawpaaLink = ->
    html = """
       |
      <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
    """
    $(document).find(SELECTOR_INSERTION_TARGET_OF_KAWPAA_LINK).append html

  sendBackground = (params) ->
    console.log params
    chrome.runtime.sendMessage params, (response) ->
      console.log response

  getParamsToServer = ->
    hostname = location.host
    console.log hostname

    switch hostname
      when 'gelbooru.com'
        originalImageSrc = $('#image').attr('src')
        srcUrl = originalImageSrc
        params =
          name: 'gelbooru'
          info:
            type: 'image'
            srcUrl: srcUrl
      when 'konachan.com'
        # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
        originalImageSrc = $('#image').attr('src')
        srcUrl = originalImageSrc
        params =
          name: 'konachan'
          info:
            type: 'image'
            srcUrl: srcUrl

    return params

  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()
    params = getParamsToServer()
    sendBackground(params)

  do showKawpaaLink