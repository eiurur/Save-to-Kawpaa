do ->

  SELECTOR_POST_SECTIONS = '#post-sections'

  showKawpaaLink = ->
    html = """
      <li><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></li>
    """
    $(document).find(SELECTOR_POST_SECTIONS).append html

  sendBackground = (params) ->
    console.log params
    chrome.runtime.sendMessage params, (response) ->
      console.log response

  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()

    # 画像のFQDN
    #   => https://danbooru.donmai.us/data/sample/sample-2a7955046380f0aaa95d83f1a4c4bd14.jpg
    #
    # 縮小後のURL ===  $('#image').attr('src') で得られる画像のURL
    #   => /data/sample/sample-2a7955046380f0aaa95d83f1a4c4bd14.jpg
    #
    # 原寸大のURL
    #   => /data/2a7955046380f0aaa95d83f1a4c4bd14.jpg
    originalImageSrc = $('#image').attr('src').replace 'sample/sample-', ''
    srcUrl = "https://danbooru.donmai.us#{originalImageSrc}"
    params =
      name: 'danbooru'
      info:
        type: 'image'
        srcUrl: srcUrl
    sendBackground(params)

  do showKawpaaLink