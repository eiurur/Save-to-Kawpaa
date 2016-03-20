$(function() {
  var ChromeSyncStorageManager, HTMLMetaDataScraper, KawpaaDataPoster, ResultAlerter;
  ChromeSyncStorageManager = (function() {
    function ChromeSyncStorageManager() {}

    ChromeSyncStorageManager.get = function(key) {
      return new Promise(function(resolve, reject) {
        return chrome.storage.sync.get([key], function(item) {
          if (item[key] === void 0 || item[key] === '') {
            return reject(void 0);
          }
          return resolve(item[key]);
        });
      });
    };

    return ChromeSyncStorageManager;

  })();
  HTMLMetaDataScraper = (function() {
    function HTMLMetaDataScraper(data1) {
      this.data = data1;
    }

    HTMLMetaDataScraper.prototype.getTitle = function() {
      var t1, t2;
      t1 = $('head title').text();
      t2 = $('meta[property="og:title"]').attr('content');
      return t1 || t2;
    };

    HTMLMetaDataScraper.prototype.getSiteName = function() {
      var sn;
      sn = $('meta[property="og:site_name"').text();
      return sn;
    };

    HTMLMetaDataScraper.prototype.getSiteURL = function() {
      var su1, su2;
      su1 = $(location).attr('href');
      su2 = $('meta[property="og:url"]').attr('content');
      return su1 || su2;
    };

    HTMLMetaDataScraper.prototype.getSiteImage = function() {
      var si;
      si = $('meta[property="og:image"]').attr('content');
      return si;
    };

    HTMLMetaDataScraper.prototype.getHostName = function() {
      var hn;
      hn = location.host;
      return hn;
    };

    HTMLMetaDataScraper.prototype.getType = function() {
      var isImage, ref, ref1, ref2, t;
      isImage = ((ref = this.data) != null ? ref.type : void 0) === 'image' || (((ref1 = this.data) != null ? ref1.mediaType : void 0) != null) && ((ref2 = this.data) != null ? ref2.menuItemId : void 0) === 'image';
      t = isImage ? 'image' : 'link';
      return t;
    };

    HTMLMetaDataScraper.prototype.getURL = function() {
      var $img, DEFUALT_URL, firstImgUrlInBody, ref, ref1, siteURL, u;
      if (this.getType() === 'image') {
        return this.data.srcUrl;
      }
      siteURL = this.getSiteURL();
      $img = $('img');
      DEFUALT_URL = 'https://36.media.tumblr.com/9086462174c34becaf8b3e59de8f5800/tumblr_nzek2kWNNJ1ukgdjoo2_1280.jpg';
      if (($img != null) && $img.length > 0) {
        console.log('画像ファイル発見', $img);
        firstImgUrlInBody = $img.get(0).src;
        u = firstImgUrlInBody || DEFUALT_URL;
      } else {
        console.log('画像ファイルが見つからない。');
        u = DEFUALT_URL;
      }

      /*
      ここから例外処理(特別処理？)
       */
      if (((ref = this.data) != null ? (ref1 = ref.url) != null ? ref1.indexOf("chrome-extension://") : void 0 : void 0) > -1) {
        console.log('ChromeExnteionsファイルを画像に設定されてしまった。');
        u = $img.get(1).src;
      }
      if (siteURL.indexOf("www.nicovideo.jp/watch/sm") > -1) {
        u = $('.videoThumbnailImage').attr('src');
      }
      if (siteURL.indexOf("xvideos.com/video") > -1) {
        u = $('img.thumb').attr('src');
      }
      return u;
    };

    HTMLMetaDataScraper.prototype.getSiteDescription = function() {
      var d1, d2;
      d1 = $('meta[name="description"]').attr('content');
      d2 = $('meta[property="og:description"]').attr('content');
      return d1 || d2;
    };

    HTMLMetaDataScraper.prototype.getFavicon = function() {
      var f;
      f = $('link[rel="shortcut icon"]').prop('href');
      return f;
    };

    HTMLMetaDataScraper.prototype.get = function() {
      return {
        title: this.getTitle(),
        siteName: this.getSiteName(),
        siteUrl: this.getSiteURL(),
        type: this.getType(),
        url: this.getURL(),
        hostName: this.getHostName(),
        description: this.getSiteDescription(),
        siteImage: this.getSiteImage(),
        favicon: this.getFavicon()
      };
    };

    return HTMLMetaDataScraper;

  })();
  KawpaaDataPoster = (function() {
    KawpaaDataPoster.prototype.DEST_URL = 'https://kawpaa.eiurur.xyz/api/posts';

    function KawpaaDataPoster(data1) {
      var htmlMetaData, htmlMetaDataScraper;
      this.data = data1 != null ? data1 : {};
      htmlMetaDataScraper = new HTMLMetaDataScraper(info);
      htmlMetaData = htmlMetaDataScraper.get();
      console.log(htmlMetaData);
      console.log('before = ', this.data);
      this.data.isPrivate = true;
      this.data.isArchive = false;
      this.data = $.extend(true, htmlMetaData, this.data);
      console.log('after = ', this.data);
    }

    KawpaaDataPoster.prototype.setToken = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return ChromeSyncStorageManager.get('token').then(function(token) {
            _this.token = token;
            return resolve(_this);
          })["catch"](function(err) {
            return reject(err);
          });
        };
      })(this));
    };

    KawpaaDataPoster.prototype.save2Server = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          console.log('save2Server = ', _this.DEST_URL);
          console.log('save2Server = ', _this.token);
          console.log('save2Server = ', _this.data);
          return $.ajax({
            type: "POST",
            url: _this.DEST_URL,
            data: {
              token: _this.token,
              post: _this.data
            },
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          }).done(function(data) {
            console.log(data);
            return resolve(data);
          }).fail(function(err) {
            return reject(err);
          });
        };
      })(this));
    };

    return KawpaaDataPoster;

  })();
  ResultAlerter = (function() {
    function ResultAlerter() {}

    ResultAlerter.displatySuccessResult = function() {
      chrome.runtime.sendMessage({
        "newIconPath": 'build/images/blue/icon19.png'
      });
      return alertify.success("保存しました。");
    };

    ResultAlerter.displatyFailedResult = function(err) {
      console.log('displatyFailedResult err = ', err);
      if (err.responseJSON != null) {
        err.statusCode = err.responseJSON.statusCode;
        err.statusMessage = err.responseJSON.message;
      } else if (err.status != null) {
        err.statusCode = err.status;
        err.statusMessage = err.statusText;
      }
      if (err.statusCode) {
        return alertify.error("Error: " + err.statusCode + " " + err.statusMessage);
      } else {
        return alertify.error("Error: トークンに誤りがあります。\nもう一度確認してみてください。");
      }
    };

    return ResultAlerter;

  })();
  return (function() {
    var kawpaaDataPoster;
    alertify.log("保存中 ......");
    kawpaaDataPoster = new KawpaaDataPoster(info);
    return kawpaaDataPoster.setToken().then(function(_) {
      return kawpaaDataPoster.save2Server();
    }).then(function(data) {
      return ResultAlerter.displatySuccessResult();
    })["catch"](function(err) {
      return ResultAlerter.displatyFailedResult(err);
    });
  })();
});
