var Tumblr;

Tumblr = (function() {
  function Tumblr(hour) {
    this.hour = hour;
    this.hour = this.hour === 0 ? 24 : this.hour;
    this.RANDOM_NUMBER = 25;
    this.API_KEY = 'HaCz28sHvTdHBp8aNp4hMdkLusoykgigKw0OP0dahWGEH8IhSq';
    this.TUMBLOG_NAME = "ritz-repo";
    this.TUMBLR_DOMAIN = this.TUMBLOG_NAME + ".tumblr.com";
    this.API_URL = "https://api.tumblr.com/v2/blog/" + this.TUMBLR_DOMAIN;
    this.info_url = this.API_URL + "/info?api_key=" + this.API_KEY;
  }

  Tumblr.prototype.getPosts = function(url) {
    return new Promise(function(resolve, reject) {
      return $.ajax({
        type: "GET",
        url: url,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        console.log('getPosts = ', data);
        return resolve(data);
      });
    });
  };

  Tumblr.prototype.getOffset = function(url) {
    return new Promise(function(resolve, reject) {
      return $.ajax({
        type: "GET",
        url: "" + url,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        var offset;
        offset = Math.floor(Math.random() * data.response.total_posts);
        return resolve(offset);
      });
    });
  };


  /*
   * 時間帯に限らない画像をランダムに取得
   */

  Tumblr.prototype.getRandomPosts = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.getOffset(_this.random_posts_url).then(function(offset) {
          return _this.getPosts(_this.random_posts_url + "&offset=" + offset + "&limit=5");
        }).then(function(data) {
          return resolve(data.response);
        });
      };
    })(this));
  };


  /*
   * 対象の時間帯に属する画像をすべて取得ver
   */

  Tumblr.prototype.getRitz = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.getPosts(_this.posts_url).then(function(data) {
          return resolve(data.response);
        });
      };
    })(this));
  };

  return Tumblr;

})();
