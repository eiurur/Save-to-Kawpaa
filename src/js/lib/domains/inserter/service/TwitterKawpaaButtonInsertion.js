import $ from 'jquery';
import {
  CONTENT_TYPE,
  SUPPORT_SERVICE_DOMAIN,
  ICONS,
} from '../../../../config';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';
import { ucs2 } from 'punycode';

export default class TwitterKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.TWITTER_HOSTNAME);
    this.container =
      '[role=main] article[role=article], [aria-labelledby="modal-header"], [data-testid="tweet"]';
    this.tweet_container = '[data-testid="tweet"]';
    this.tweet_url = 'a[role=link][aria-label]';
    this.tweet_image = 'img[draggable]';
    this.tweet_video = 'video';
    this.kawpaa_button_container = '.action-kawpaa-container';
    this.kawpaa_button = '.ProfileTweet-actionList';
  }

  // getTweetType(element) {
  //   const hasVideo = element.find(this.tweet_video).length > 0;
  //   const hasPhoto = element.find(this.tweet_image).length > 0;

  //   if (hasVideo) {
  //     return 'video';
  //   }
  //   if (hasPhoto) {
  //     return 'photo';
  //   }
  //   return 'text';
  // }

  getTweetType(entities) {
    if (!entities.media || !entities.media[0]) {
      return 'text';
    }
    if (entities.media[0].video_info) {
      return 'video';
    }
    if (entities.media) {
      return 'photo';
    }
    return 'text';
  }

  async getInfo(targetElement) {
    let tweetUrl = '';
    if (document.location.href.indexOf('/status/') !== -1) {
      tweetUrl = document.location.href;
    } else {
      const tu = targetElement
        .closest(this.tweet_container)
        .find(this.tweet_url);
      if (tu && tu.length > 0) {
        tweetUrl = `https://twitter.com${tu.first().attr('href')}`;
      } else {
        tweetUrl = document.location.href;
      }
    }

    const tweetMatch = /status\/(\d+).*/.exec(tweetUrl);
    const photoMatch = /status\/(\d+)\/photo\/(\d)+/.exec(tweetUrl);
    const tweetId = tweetMatch ? tweetMatch[1] : null;
    const indexIdx = photoMatch ? photoMatch[2] - 1 : 0;
    const { data } = await this.fetchTweet(tweetId);
    let tweet = data.data; // originalのtweetIDを取得できているのでretweetedの判定は不要
    let user = tweet.user;

    let siteUrl = tweetUrl;
    let title = `${user.name} @${user.screen_name} / ${tweet.full_text}`;
    let info = { siteUrl, title };

    const tweetType = this.getTweetType(tweet.extended_entities);
    switch (tweetType) {
      case 'photo': {
        if (
          !tweet.extended_entities ||
          !tweet.extended_entities.media ||
          tweet.extended_entities.media.length === 0
        ) {
          break;
        }
        const media = tweet.extended_entities.media[indexIdx];
        const imageUrl = media.media_url_https;
        info = Object.assign(info, {
          type: CONTENT_TYPE.IMAGE,
          srcUrl: imageUrl,
        });
        break;
      }
      case 'video': {
        const videos = tweet.extended_entities.media[0].video_info.variants;
        const mp4VideoHasHighestSize = videos
          .filter((video) => video.bitrate)
          .sort((a, b) => b.bitrate - a.bitrate)[0];
        const videoUrl = mp4VideoHasHighestSize.url;
        info = Object.assign(info, {
          type: CONTENT_TYPE.VIDEO,
          url: videoUrl,
          srcUrl: videoUrl,
        });
        break;
      }
    }
    return info;
  }

  fetchTweet(tweetId) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          func: 'fetchTweet',
          tweetId: tweetId,
        },
        (data) => {
          return resolve(data);
        }
      );
    });
  }

  show(_$) {
    const existKawpaaButton =
      _$.find(this.kawpaa_button_container).length !== 0;
    const hasPhoto = _$.find('[aria-label]').find(this.tweet_image).length > 0;
    const hasVideo = _$.find(this.tweet_video).length > 0;
    if (existKawpaaButton || !(hasPhoto || hasVideo)) return;

    let actions = [];
    const isDialog = _$.find('[role="dialog"]');
    if (isDialog) {
      actions = _$.find('[role=group]');
    } else {
      actions = _$.find('[aria-label][role=group]');
    }
    if (!actions.length) return;

    const headAction = $(actions).children('div:first');
    const followingActions = $(actions).children('div:not(:first)');
    const headActionClasses = $(headAction).attr('class');
    $(followingActions).removeClass().addClass(headActionClasses);
    const html = `\
      <div  class="action-kawpaa-container" style="
        display: flex;
        flex-basis: auto;
        flex-direction: column;
        flex-shrink: 0;
        margin: 0px;
        min-height: 0px;
        min-width: 0px;
        padding: 0px;
        position: relative;
        z-index: 0;
      ">
        <a class="${this.kawpaaLinkClassName}" href="#" data-original-title="Save to Kawpaa" style="
          display: flex;
          height: 100%;
          align-items: center;
        ">
          <span class="icon icon-kawpaa" style="display: block; height: 16px; position: relative;  width: 16px; background-image: url(${ICONS.GRAY_16});"></span>
        </a>
      </div>\
    `;
    return _$.find('[role=group]').append(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, function (e) {
      e.preventDefault();
      e.stopPropagation();

      // 画像の差し替え
      $(this)
        .find('.icon-kawpaa')
        .css('background-image', `url(${ICONS.BLUE_16})`);

      const targetElement = $(this).closest(_this.container);
      _this
        .getInfo(targetElement)
        .then((info) => _this.getParamsToServer(info))
        .then((params) => _this.send(params));
    });
  }

  onMouseEnter() {
    const _this = this;
    $(document).on(
      {
        mouseenter: function (e) {
          _this.show($(this));
        },
      },
      _this.container
    );
  }
}
