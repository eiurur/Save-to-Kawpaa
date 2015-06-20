$ ->

  ###
  For options.html
  ###

  chrome.storage.sync.get "token", (item) ->
    token = item.token
    # showBlogName token
    $("#token").val token
    # showTumblrPost token  if token isnt "undefined"

  $("#token").bind "keyup", ->
    token = $("#token").val()
    item = token: token
    chrome.storage.sync.set item, ->

      # TODO: Ajaxで問い合わせて、存在したらok、なければngをメッセージで出力
      $('#console').html 'tststs'






  # extractTweetImageUrl = (caption) ->

  #   # URL-正規表現サンプル集 http://www.megasoft.co.jp/mifes/seiki/s310.html
  #   # https://pbs~
  #   # re_url = /https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+/

  #   # pic.twitter~
  #   re_url = /pic[\w\/:%#\$&\?\(\)~\.=\+\-]+/
  #   imageUrl = re_url.exec caption
  #   if imageUrl? then imageUrl[0] else null

  # assignResponseHtml = (post) ->

    # tumblrにTwitterの画像URLを追記し忘れたときは、tumblrのポストURLを指定する。
    # postUrl = extractTweetImageUrl(post.caption) || post.post_url
    # """
    # <a href="https://twitter.com/intent/tweet?text=#{postUrl}" title="Tweetする">
    #   <img src=#{post.photos[0].original_size.url} >
    # </a>
    # """

  # getHours = ->
  #   date = new Date()
  #   date.getHours()


  # ###
  # # Main
  # ###
  # nowHour = getHours()
  # tumblr  = new Tumblr nowHour

  # # 時間帯に適した画像だけだと寂しいので、時間帯に関係のない画像もランダムで抽出する
  # promises = [tumblr.getRitz(), tumblr.getRandomPosts()]
  # Promise.all promises
  # .then (values) ->
  #   html = ''
  #   values.forEach (images) ->
  #     images.posts.forEach (post) -> html += assignResponseHtml post
  #   $('.Trends').before html
