import $ from "jquery";
import { targets, icons } from "../../config";
import KawpaaButtonInsertion from "../KawpaaButtonInsertion";

export default class TweetDeckKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(targets.TWEETDECK_HOSTNAME);

    this.container = ".s-full";
    this.twitter_name = ".account-inline";
    this.tweet_text = ".tweet-text";
    this.tweet_image = ".media-img";
    this.kawpaa_button_container = ".action-kawpaa-container";
    this.kawpaa_button = ".tweet-actions";
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      const info = {
        siteUrl: targetElement.find(".tweet-timestamp > a").attr("href"),
        title: `${targetElement
          .find(this.twitter_name)
          .text()} / ${targetElement.find(this.tweet_text).text()}`,
        srcUrl: `${targetElement
          .find(this.tweet_image)
          .attr("src")
          .replace(":large", "")}:orig`
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
      <li class="tweet-action-item action-kawpaa-container pull-left margin-r--13">
        <a class="js-show-tip tweet-action kawpaa-save-link" href="#" title="" data-original-title="Save to Kawpaa">
          <span class="icon icon-kawpaa txt-right" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(${icons.GRAY_16});"></span>
        </a>
      </li>\
    `;
    return _$.find(this.kawpaa_button).append(html);
  }

  onClick() {
    const _this = this;
    $(document).on("click", this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this)
        .find(".icon-kawpaa")
        .css("background-image", "url(" + icons.BLUE_16 + ")");

      const targetElement = $(this).closest(_this.container);
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
  }
}
