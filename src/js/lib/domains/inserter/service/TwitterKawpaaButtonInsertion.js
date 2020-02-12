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
    this.container = '[role=main] article[role=article]';
    this.tweet_container = '[data-testid=tweet]';
    this.tweet_url = 'a[role=link][aria-label]';
    this.twitter_username =
      'a[role=link][aria-haspopup="false"][data-focusable="true"]'; // ぴゃー @puaa
    this.tweet_text = '[lang][dir=auto]';
    this.tweet_image = 'img[draggable]';
    this.tweet_video = 'video';
    this.kawpaa_button_container = '.action-kawpaa-container';
    this.kawpaa_button = '.ProfileTweet-actionList';
  }

  getTweetType(element) {
    const hasVideo = element.find(this.tweet_video).length > 0;
    const hasPhoto = element.find(this.tweet_image).length > 0;

    if (hasVideo) {
      return 'video';
    }
    if (hasPhoto) {
      return 'photo';
    }
    return 'text';
  }

  async getInfo(targetElement) {
    let tweetUrl = '';
    if (document.location.href.indexOf('/status/') !== -1) {
      tweetUrl = document.location.href;
    } else {
      const tu = targetElement.find(this.tweet_container).find(this.tweet_url);
      if (tu && tu.length > 0) {
        tweetUrl = `https://twitter.com${tu.first().attr('href')}`;
      } else {
        tweetUrl = document.location.href;
      }
    }
    let siteUrl = tweetUrl;

    let username = targetElement.find(this.twitter_username).text();
    let text = targetElement.find(this.tweet_text).text();
    let title = `${username} / ${text}`;
    let info = { siteUrl, title };

    const tweetType = this.getTweetType(targetElement);

    switch (tweetType) {
      case 'photo': {
        const srcList = targetElement
          .find('[aria-label] img')
          .map(function(i, image) {
            return $(image).attr('src');
          })
          .get();
        const images = srcList.filter(
          image => image.indexOf('https://pbs.twimg.com/media/') !== -1,
        );
        if (images.length < 1) break;
        let imageUrl = images[0];

        imageUrl = imageUrl.replace(/name=(.*)/, 'name=large');
        info = Object.assign(info, {
          type: CONTENT_TYPE.IMAGE,
          srcUrl: imageUrl,
        });
        break;
      }
      case 'video': {
        let videoUrl = targetElement.find('video').attr('src'); // 動画(mp4)
        if (/\.mp4/.test(videoUrl)) {
          info = Object.assign(info, {
            type: CONTENT_TYPE.VIDEO,
            url: videoUrl,
            srcUrl: videoUrl,
          });
        } else {
          const tweetId = /status\/(\d+)$/.exec(tweetUrl)[1];
          const { data } = await this.fetchTweet(tweetId);
          console.log(data);
          const videos =
            data.data.extended_entities.media[0].video_info.variants;
          videoUrl = videos.sort((a, b) => b.bitrate - a.bitrate)[0].url;
          info = Object.assign(info, {
            type: CONTENT_TYPE.VIDEO,
            url: videoUrl,
            srcUrl: videoUrl,
          });
        }
        break;
      }
    }
    console.log(info);
    return info;
  }

  fetchTweet(tweetId) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        {
          func: 'fetchTweet',
          tweetId: tweetId,
        },
        data => {
          return resolve(data);
        },
      );
    });
  }

  show(_$) {
    const existKawpaaButton =
      _$.find(this.kawpaa_button_container).length !== 0;
    const hasPhoto = _$.find('[aria-label]').find(this.tweet_image).length > 0;
    const hasVideo = _$.find(this.tweet_video).length > 0;
    console.log(existKawpaaButton, hasPhoto, hasVideo);
    if (existKawpaaButton || !(hasPhoto || hasVideo)) return;

    const actions = _$.find('[aria-label][role=group]');
    if (!actions.length) return;

    const headAction = $(actions).children('div:first');
    const followingActions = $(actions).children('div:not(:first)');
    const headActionClasses = $(headAction).attr('class');
    $(followingActions)
      .removeClass()
      .addClass(headActionClasses);
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
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this)
        .find('.icon-kawpaa')
        .css('background-image', `url(${ICONS.BLUE_16})`);

      const targetElement = $(this).closest(_this.container);
      _this
        .getInfo(targetElement)
        .then(info => _this.getParamsToServer(info))
        .then(params => _this.send(params));
    });
  }

  onMouseEnter() {
    console.log('on');
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
}
