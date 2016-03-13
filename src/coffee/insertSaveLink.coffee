do ->

  getSelectorInsertionTagetOfKawpaaLink = ->
    result = null
    hostname = location.host
    switch hostname
      when 'chan.sankakucomplex.com'
        result = '#share'
      when 'danbooru.donmai.us'
        result = '#post-sections'
      when 'gelbooru.com', 'konachan.com', 'yande.re'
        result = '#right-col h4'
    return result

  getHtmlToInsert = ->
    result = null
    hostname = location.host
    switch hostname
      when 'chan.sankakucomplex.com'
        result = """
          <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
        """
      when 'danbooru.donmai.us'
        result = """
          <li><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></li>
        """
      when 'gelbooru.com', 'konachan.com', 'yande.re'
        result = """
           |
          <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>
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
      result = null
      hostname = location.host
      console.log hostname
      switch hostname
        when 'chan.sankakucomplex.com'
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
            result =
              name: 'sankakucomplex'
              info:
                type: 'image'
                srcUrl: srcUrl
            return resolve result
          $('#image').click()
        when 'danbooru.donmai.us'
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
          result =
            name: 'danbooru'
            info:
              type: 'image'
              srcUrl: srcUrl
          return resolve result
        when 'gelbooru.com'
          originalImageSrc = $('#image').attr('src')
          srcUrl = originalImageSrc
          result =
            name: 'gelbooru'
            info:
              type: 'image'
              srcUrl: srcUrl
          return resolve result
        when 'konachan.com'
          # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
          originalImageSrc = $('#image').attr('src')
          srcUrl = originalImageSrc
          result =
            name: 'konachan'
            info:
              type: 'image'
              srcUrl: srcUrl
          return resolve result
        when 'yande.re'
          # 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
          originalImageSrc = $('#image').attr('src')
          srcUrl = originalImageSrc
          result =
            name: 'yande.re'
            info:
              type: 'image'
              srcUrl: srcUrl
          return resolve result
      return

  $(document).on 'click', '.kawpaa-save-link', (e) ->
    e.preventDefault()
    getParamsToServer().then (params) -> sendBackground(params)


  do showKawpaaLink