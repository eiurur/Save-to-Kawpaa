var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function() {
  var DANBOORU_HOSTNAME, DATA_URL_BLUE_16, DEVIANTART_HOSTNAME, DanbooruKawpaaLinkInserter, DevianArtKawpaaLinkInserter, GELBOORU_HOSTNAME, GelbooruKawpaaLinkInserter, KONACHAN_HOSTNAME, KawpaaLinkInserter, KonachanKawpaaLinkInserter, PIXIV_HOSTNAME, PixivKawpaaLinkInserter, SANKAKUCOMPLEX_HOSTNAME, SankakuComplexKawpaaLinkInserter, YANDE_RE_HOSTNAME, YandereKawpaaLinkInserter, getSaveTokawpaaLinkInserter, saveToKawpaaLinkInserter;
  DANBOORU_HOSTNAME = 'danbooru.donmai.us';
  DEVIANTART_HOSTNAME = 'deviantart.com';
  GELBOORU_HOSTNAME = 'gelbooru.com';
  KONACHAN_HOSTNAME = 'konachan.com';
  PIXIV_HOSTNAME = 'www.pixiv.net';
  SANKAKUCOMPLEX_HOSTNAME = 'chan.sankakucomplex.com';
  YANDE_RE_HOSTNAME = 'yande.re';
  DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII=";
  KawpaaLinkInserter = (function() {
    function KawpaaLinkInserter(hostname1) {
      this.hostname = hostname1;
      this.selector = null;
      this.html = null;
    }

    KawpaaLinkInserter.prototype.insert = function() {
      return $(document).find(this.selector).append(this.html);
    };

    KawpaaLinkInserter.prototype.getParamsToServer = function() {};

    KawpaaLinkInserter.prototype.bindClickEvent = function() {
      return $(document).on('click', '.kawpaa-save-link', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.getParamsToServer().then(function(params) {
            return _this.sendBackground(params);
          });
        };
      })(this));
    };

    KawpaaLinkInserter.prototype.sendBackground = function(params) {
      return chrome.runtime.sendMessage(params, function(response) {
        return console.log(response);
      });
    };

    return KawpaaLinkInserter;

  })();
  DanbooruKawpaaLinkInserter = (function(superClass) {
    extend(DanbooruKawpaaLinkInserter, superClass);

    function DanbooruKawpaaLinkInserter() {
      DanbooruKawpaaLinkInserter.__super__.constructor.call(this, DANBOORU_HOSTNAME);
      this.selector = '#post-sections';
      this.html = "<li><a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a></li>";
    }

    DanbooruKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var imgUrl, originalImageSrc, params, srcUrl;
          params = {
            info: {
              type: 'image'
            }
          };
          imgUrl = $('#image-resize-link').attr('href') || $('#image').attr('src');
          originalImageSrc = imgUrl.replace('sample/sample-', '');
          srcUrl = "https://danbooru.donmai.us" + originalImageSrc;
          params.name = DANBOORU_HOSTNAME;
          params.info.srcUrl = srcUrl;
          return resolve(params);
        };
      })(this));
    };

    return DanbooruKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  GelbooruKawpaaLinkInserter = (function(superClass) {
    extend(GelbooruKawpaaLinkInserter, superClass);

    function GelbooruKawpaaLinkInserter() {
      GelbooruKawpaaLinkInserter.__super__.constructor.call(this, GELBOORU_HOSTNAME);
      this.selector = '#right-col h4';
      this.html = " |\n<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
    }

    GelbooruKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var originalImageSrc, params, srcUrl;
          params = {
            info: {
              type: 'image'
            }
          };
          originalImageSrc = $('#image').attr('src');
          srcUrl = originalImageSrc;
          params.name = GELBOORU_HOSTNAME;
          params.info.srcUrl = srcUrl;
          return resolve(params);
        };
      })(this));
    };

    return GelbooruKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  KonachanKawpaaLinkInserter = (function(superClass) {
    extend(KonachanKawpaaLinkInserter, superClass);

    function KonachanKawpaaLinkInserter() {
      KonachanKawpaaLinkInserter.__super__.constructor.call(this, KONACHAN_HOSTNAME);
      this.selector = '#right-col h4';
      this.html = " |\n<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
    }

    KonachanKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var originalImageSrc, params, srcUrl;
          params = {
            info: {
              type: 'image'
            }
          };
          originalImageSrc = $('#image').attr('src');
          srcUrl = originalImageSrc;
          params.name = KONACHAN_HOSTNAME;
          params.info.srcUrl = srcUrl;
          return resolve(params);
        };
      })(this));
    };

    return KonachanKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  YandereKawpaaLinkInserter = (function(superClass) {
    extend(YandereKawpaaLinkInserter, superClass);

    function YandereKawpaaLinkInserter() {
      YandereKawpaaLinkInserter.__super__.constructor.call(this, YANDE_RE_HOSTNAME);
      this.selector = '#right-col h4';
      this.html = " |\n<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
    }

    YandereKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var originalImageSrc, params, srcUrl;
          params = {
            info: {
              type: 'image'
            }
          };
          originalImageSrc = $('#image').attr('src');
          srcUrl = originalImageSrc;
          params.name = YANDE_RE_HOSTNAME;
          params.info.srcUrl = srcUrl;
          return resolve(params);
        };
      })(this));
    };

    return YandereKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  PixivKawpaaLinkInserter = (function(superClass) {
    extend(PixivKawpaaLinkInserter, superClass);

    function PixivKawpaaLinkInserter() {
      PixivKawpaaLinkInserter.__super__.constructor.call(this, PIXIV_HOSTNAME);
      this.selector = '.bookmark-container';
      this.html = "<a href=\"#\" class=\"add-bookmark _button kawpaa-save-link\">Save to Kawpaa</a>";
    }

    PixivKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var originalImageSrc, params, srcUrl;
          params = {
            info: {
              type: 'image'
            }
          };
          originalImageSrc = $('.original-image').data('src');
          srcUrl = originalImageSrc;
          params.name = PIXIV_HOSTNAME;
          params.info.srcUrl = srcUrl;
          return resolve(params);
        };
      })(this));
    };

    return PixivKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  SankakuComplexKawpaaLinkInserter = (function(superClass) {
    extend(SankakuComplexKawpaaLinkInserter, superClass);

    function SankakuComplexKawpaaLinkInserter() {
      SankakuComplexKawpaaLinkInserter.__super__.constructor.call(this, SANKAKUCOMPLEX_HOSTNAME);
      this.selector = '#share';
      this.html = "<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
    }

    SankakuComplexKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var params;
          params = {
            info: {
              type: 'image'
            }
          };
          $('#image').on('click', function(e) {
            var originalImageSrc, srcUrl;
            originalImageSrc = $('#image').attr('src');
            srcUrl = "https:" + originalImageSrc;
            params.name = SANKAKUCOMPLEX_HOSTNAME;
            params.info.srcUrl = srcUrl;
            return resolve(params);
          });
          return $('#image').click();
        };
      })(this));
    };

    return SankakuComplexKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  DevianArtKawpaaLinkInserter = (function(superClass) {
    extend(DevianArtKawpaaLinkInserter, superClass);

    function DevianArtKawpaaLinkInserter() {
      DevianArtKawpaaLinkInserter.__super__.constructor.call(this, DEVIANTART_HOSTNAME);
      this.selector = '.dev-meta-actions';
      this.html = "<a class=\"dev-page-button dev-page-button-with-text dev-page-download kawpaa-save-link\" href=\"#\" data-download_url=\"http://www.deviantart.com/download/460347620/gochiusa_by_azizkeybackspace-d7m2uhw.png?token=a6e80ce8b02c8c1dc7762417c29bf3d3b57bd13d&amp;ts=1458132778\">\n <i style=\"background: url(" + DATA_URL_BLUE_16 + "); background-position: none; background-repeat: no-repeat;\"></i>\n <span class=\"label\">Save to Kawpaa</span>\n</a>";
    }

    DevianArtKawpaaLinkInserter.prototype.getParamsToServer = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var params, sampleImgUrl, srcUrl;
          params = {
            info: {
              type: 'image'
            }
          };
          sampleImgUrl = $('.dev-content-full').attr('src');
          srcUrl = sampleImgUrl;
          params.name = DEVIANTART_HOSTNAME;
          params.info.srcUrl = srcUrl;
          return resolve(params);
        };
      })(this));
    };

    return DevianArtKawpaaLinkInserter;

  })(KawpaaLinkInserter);
  getSaveTokawpaaLinkInserter = function() {
    var hostname;
    hostname = location.host;
    console.log(hostname);
    switch (hostname) {
      case DANBOORU_HOSTNAME:
        return new DanbooruKawpaaLinkInserter();
      case GELBOORU_HOSTNAME:
        return new GelbooruKawpaaLinkInserter();
      case KONACHAN_HOSTNAME:
        return new KonachanKawpaaLinkInserter();
      case YANDE_RE_HOSTNAME:
        return new YandereKawpaaLinkInserter();
      case PIXIV_HOSTNAME:
        return new PixivKawpaaLinkInserter();
      case SANKAKUCOMPLEX_HOSTNAME:
        return new SankakuComplexKawpaaLinkInserter();
      default:
        if (hostname.indexOf(DEVIANTART_HOSTNAME) !== -1) {
          return new DevianArtKawpaaLinkInserter();
        }
    }
  };
  saveToKawpaaLinkInserter = getSaveTokawpaaLinkInserter();
  saveToKawpaaLinkInserter.insert();
  return saveToKawpaaLinkInserter.bindClickEvent();
})();
