import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE, ICONS } from '../../../../config/';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

import ChromeSyncStorageManager from '../../../utils/ChromeSyncStorageManager';
import KawpaaSender from '../../KawpaaSender';
export default class TwitterKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE.TWITTER_HOSTNAME);
    this.container = '.permalink-tweet-container';
    this.stream_tweet = '.js-stream-tweet';
    this.tweet_container = '.permalink-tweet';
    this.tweet_url = '.tweet-timestamp';
    this.twitter_fullname = '.fullname'; // ぴゃー
    this.twitter_username = '.username'; // @puaa
    this.tweet_text = '.js-tweet-text';
    this.tweet_image = '.js-adaptive-photo';
    this.tweet_media = '.media-image';
    this.tweet_video = '.AdaptiveMedia-video';
    this.kawpaa_button_container = '.action-kawpaa-container';
    this.kawpaa_button = '.ProfileTweet-actionList';
  }

  getTweetType(element) {
    const hasPhoto = element.find(this.tweet_image).length > 0;
    const hasVideo = element.find(this.tweet_video).length > 0;

    if (hasPhoto) {
      return 'photo';
    }
    if (hasVideo) {
      return 'video';
    }
    return 'text';
  }

  async getInfo(targetElement) {
    let tweetUrl =
      targetElement.find(this.tweet_url).attr('href') ||
      targetElement.find(this.tweet_container).data('permalink-path');
    let siteUrl = `https://twitter.com${tweetUrl}`;

    let fullname = targetElement.find(this.twitter_fullname).text();
    let username = targetElement.find(this.twitter_username).text();
    let monoUsername = /^@(\w)*/.exec(username)[0]; // ツイート詳細モーダルだと複数の@usernameが取得されるので単一にする。
    let text = targetElement.find(this.tweet_text).text();
    let title = `${fullname} ${monoUsername} / ${text}`;
    let info = { siteUrl, title };

    const tweetType = this.getTweetType(targetElement);

    switch (tweetType) {
      case 'photo': {
        let imageUrl = targetElement
          .find(this.tweet_image)
          .attr('data-image-url');
        // 複数枚のときは今見ている画像を保存する。
        imageUrl =
          $(this.tweet_media)
            .first()
            .attr('src') || imageUrl;
        imageUrl = imageUrl.replace(':large', '');

        info = Object.assign(info, {
          type: CONTENT_TYPE.IMAGE,
          srcUrl: `${imageUrl}:orig`,
        });
        break;
      }
      case 'video': {
        const tweetId = /status\/(\d+)$/.exec(tweetUrl)[1];
        const { data } = await this.fetchTweet(tweetId);
        const videos = data.data.extended_entities.media[0].video_info.variants;
        const videoUrl = videos.sort((a, b) => b.bitrate - a.bitrate)[0].url;
        console.log(videoUrl);
        info = Object.assign(info, {
          type: CONTENT_TYPE.VIDEO,
          url: videoUrl,
          srcUrl: videoUrl,
        });
        break;
      }
    }
    console.log(info);
    return info;
  }

  show(_$) {
    const existKawpaaButton =
      _$.find(this.kawpaa_button_container).length !== 0;
    const hasPhoto = _$.find(this.tweet_image).length > 0;
    const hasVideo = _$.find(this.tweet_video).length > 0;
    if (existKawpaaButton || !(hasPhoto || hasVideo)) {
      return;
    }

    const html = `\
      <div class="ProfileTweet-action action-kawpaa-container" style="display: inline-block; min-width:80px;">
        <a class="${
          this.kawpaaLinkClassName
        } js-tooltip" href="#" data-original-title="Save to Kawpaa" style="display: inline-block; float: left;">
          <span class="icon icon-kawpaa" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(${
            ICONS.GRAY_16
          });"></span>
        </a>
      </div>\
    `;
    return _$.find('.ProfileTweet-action--dm').after(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this)
        .find('.icon-kawpaa')
        .css('background-image', 'url(' + ICONS.BLUE_16 + ')');

      const $jsStreamTweet = $(this).closest(_this.stream_tweet);
      const $permalinkTweetContaner = $(this).closest(_this.tweet_container);
      const nowPageVariable =
        $jsStreamTweet.length > 0 ? 'homeTImeline' : void 0;
      var targetElement = null;
      switch (nowPageVariable) {
        case 'homeTImeline':
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
        },
      },
      _this.container,
    );

    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this));
        },
      },
      _this.stream_tweet,
    );
  }

  async fetchTweet(tweetId) {
    const token = await ChromeSyncStorageManager.get('token');
    const payload = {
      token: token,
    };
    const sender = new KawpaaSender(payload);
    return await sender.get(`/api/convert/tweet/${tweetId}`);
  }
}
