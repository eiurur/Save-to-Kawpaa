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

  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()
    originalImageSrc = $('#image').attr('src')
    srcUrl = originalImageSrc
    params =
      name: 'gelbooru'
      info:
        type: 'image'
        srcUrl: srcUrl
    sendBackground(params)

  do showKawpaaLink