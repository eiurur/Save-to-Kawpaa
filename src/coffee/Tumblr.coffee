class Tumblr
  constructor: (@hour) ->
    @hour             = if @hour is 0 then 24 else @hour
    @RANDOM_NUMBER    = 25
    @API_KEY          = 'HaCz28sHvTdHBp8aNp4hMdkLusoykgigKw0OP0dahWGEH8IhSq'
    @TUMBLOG_NAME     = "ritz-repo"
    @TUMBLR_DOMAIN    = "#{@TUMBLOG_NAME}.tumblr.com"
    @API_URL          = "https://api.tumblr.com/v2/blog/#{@TUMBLR_DOMAIN}"
    @info_url         = "#{@API_URL}/info?api_key=#{@API_KEY}"

  getPosts: (url) ->
    return new Promise (resolve, reject) ->
      $.ajax
        type: "GET"
        url: url
        headers: "Access-Control-Allow-Origin": "*"
      .done (data) ->
        console.log 'getPosts = ', data
        return resolve data

  getOffset: (url) ->
    return new Promise (resolve, reject) ->
      $.ajax
        type: "GET"
        url: "#{url}"
        headers: "Access-Control-Allow-Origin": "*"
      .done (data) ->
        offset = Math.floor(Math.random() * data.response.total_posts)
        return resolve offset

  ###
  # 時間帯に限らない画像をランダムに取得
  ###
  getRandomPosts: ->
    return new Promise (resolve, reject) =>
      @getOffset @random_posts_url
      .then (offset) =>
        @getPosts "#{@random_posts_url}&offset=#{offset}&limit=5"
      .then (data) ->
        # console.log 'getRandomPosts = ', data.response
        return resolve data.response

  ###
  # 対象の時間帯に属する画像をすべて取得ver
  ###
  getRitz: ->
    return new Promise (resolve, reject) =>
      @getPosts @posts_url
      .then (data) ->
        # console.log 'getRitz = ', data.response
        return resolve data.response