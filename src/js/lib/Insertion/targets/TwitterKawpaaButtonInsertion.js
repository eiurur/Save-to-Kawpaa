const $ = require("jquery");
const { targets, icons } = require("../../config");
const KawpaaButtonInsertion = require("../KawpaaButtonInsertion");

module.exports = class TwitterKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(targets.TWITTER_HOSTNAME);

    this.container = ".permalink-tweet-container";
    this.stream_tweet = ".js-stream-tweet";
    this.tweet_container = ".permalink-tweet";
    this.tweet_url = ".tweet-timestamp";
    this.twitter_name = ".js-action-profile-name";
    this.tweet_text = ".js-tweet-text";
    this.tweet_image = ".js-adaptive-photo";
    this.tweet_media = ".media-image";
    this.kawpaa_button_container = ".action-kawpaa-container";
    this.kawpaa_button = ".ProfileTweet-actionList";
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      var tweetUrl =
        targetElement.find(this.tweet_url).attr("href") ||
        targetElement.find(this.tweet_container).data("permalink-path");
      var title = `${targetElement
        .find(this.twitter_name)
        .text()} / ${targetElement.find(this.tweet_text).text()}`;
      var imageUrl = targetElement
        .find(this.tweet_image)
        .attr("data-image-url");

      // 複数枚のときは今見ている画像を保存する。
      imageUrl = $(this.tweet_media).first().attr("src") || imageUrl;
      imageUrl = imageUrl.replace(":large", "");

      const info = {
        siteUrl: `https://twitter.com${tweetUrl}`,
        title: title,
        srcUrl: `${imageUrl}:orig`
      };
      console.log(info);
      return resolve(info);
    });
  }

  show(_$) {
    const existKawpaaButton =
      _$.find(this.kawpaa_button_container).length !== 0;
    const hasPhoto = _$.find(this.tweet_image).length > 0;
    if (existKawpaaButton || !hasPhoto) {
      return;
    }

    const html = `\
      <div class="ProfileTweet-action action-kawpaa-container" style="display: inline-block; min-width:80px;">
        <a class="js-tooltip kawpaa-save-link" href="#" data-original-title="Save to Kawpaa" style="display: inline-block; float: left;">
          <span class="icon icon-kawpaa" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(${icons.GRAY_16});">a</span>
        </a>
      </div>\
    `;
    return _$.find(".ProfileTweet-action--dm").after(html);
  }

  onClick() {
    const _this = this;
    $(document).on("click", this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this)
        .find(".icon-kawpaa")
        .css("background-image", "url(" + icons.BLUE_16 + ")");

      const $jsStreamTweet = $(this).closest(_this.stream_tweet);
      const $permalinkTweetContaner = $(this).closest(_this.tweet_container);
      const nowPageVariable = $jsStreamTweet.length > 0
        ? "homeTImeline"
        : void 0;
      var targetElement = null;
      switch (nowPageVariable) {
        case "homeTImeline":
          targetElement = $jsStreamTweet;
          break;
        default:
          targetElement = $permalinkTweetContaner;
      }

      _this
        .getInfo(targetElement)
        .then(info => _this.getParamsToServer(info))
        .then(params => _this.send(params));
    });
  }

  onMouseEnter() {
    const _this = this;
    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this));
        }
      },
      _this.container
    );

    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this));
        }
      },
      _this.stream_tweet
    );
  }
};
