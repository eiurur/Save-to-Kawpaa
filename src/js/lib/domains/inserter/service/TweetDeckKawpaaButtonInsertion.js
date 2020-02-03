import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE, ICONS } from '../../../../config';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

import ChromeSyncStorageManager from '../../../utils/ChromeSyncStorageManager';
import KawpaaAgent from '../../KawpaaAgent';

export default class TweetDeckKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE.TWEETDECK_HOSTNAME);

    this.container = '.s-full';
    this.twitter_name = '.account-inline';
    this.tweet_text = '.tweet-text';
    this.tweet_image = '.media-img';
    this.tweet_video = '.js-media-native-video';
    this.kawpaa_button_container = '.action-kawpaa-container';
    this.kawpaa_button = '.tweet-actions';
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
    const siteUrl = targetElement.find('.tweet-timestamp > a').attr('href');
    const title = `${targetElement
      .find(this.twitter_name)
      .text()} / ${targetElement.find(this.tweet_text).text()}`;
    let info = { siteUrl, title };

    const tweetType = this.getTweetType(targetElement);
    switch (tweetType) {
      case 'photo': {
        const imageUrl = `${targetElement
          .find(this.tweet_image)
          .attr('src')
          .replace('name=large', 'name=orig')}`;
        info = Object.assign(info, {
          type: CONTENT_TYPE.IMAGE,
          srcUrl: imageUrl,
        });
        break;
      }
      case 'video': {
        const tweetId = /status\/(\d+)$/.exec(siteUrl)[1];
        const { data } = await this.fetchTweet(tweetId);
        const videos = data.data.extended_entities.media[0].video_info.variants;
        const videoUrl = videos.splice(-2, 1)[0].url;
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
      <li class="tweet-action-item action-kawpaa-container pull-left margin-r--13">
        <a class="${this.kawpaaLinkClassName} js-show-tip tweet-action" href="#" title="" data-original-title="Save to Kawpaa">
          <span class="icon icon-kawpaa txt-right" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(${ICONS.GRAY_16});"></span>
        </a>
      </li>\
    `;
    return _$.find(this.kawpaa_button).append(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this)
        .find('.icon-kawpaa')
        .css('background-image', 'url(' + ICONS.BLUE_16 + ')');

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
        },
      },
      _this.container,
    );
  }

  async fetchTweet(tweetId) {
    const token = await ChromeSyncStorageManager.get('token');
    const payload = {
      token: token,
    };
    const agent = new KawpaaAgent(payload);
    return await agent.get(`/api/convert/tweet/${tweetId}`);
  }
}
