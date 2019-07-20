import $ from 'jquery';
import { SUPPORT_SERVICE, ICONS } from '../../../../config';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

export default class AmatsukaLinkInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE.AMATSUKA_HOSTNAME);
    this.container = '.image-layer';
    this.kawpaaButtonContainer = '.kawpaa-button-container';
    console.log(SUPPORT_SERVICE.AMATSUKA_HOSTNAME);
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      const tweetUrl = targetElement.attr('data-siteurl');

      const name = targetElement.attr('data-name');
      const screenName = `@${targetElement.attr('data-screen_name')}`;
      const text = targetElement.attr('data-description');
      const title = `${name} ${screenName} / ${text}`;

      const srcUrl = targetElement.attr('data-url');

      const info = {
        siteUrl: tweetUrl,
        title: title,
        srcUrl: srcUrl,
      };
      return resolve(info);
    });
  }

  show(_$) {
    const existKawpaaButton = _$.find(this.kawpaaButtonContainer).length !== 0;
    if (existKawpaaButton) {
      return;
    }

    const html = `\
      <div class="kawpaa-button-container" style="display: inline-block; cursor: pointer; padding-right: 50px;" title="Kawpaaに保存する">
        <span class="icon icon-kawpaa ${
          this.kawpaaLinkClassName
        }" style="display: block; height: 24px; position: relative; width: 24px; background-image: url(${
      ICONS.GRAY_24
    });">
      </span>
      </div>\
    `;
    return _$.find('.timeline__footer__controls').append(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();
      $(this).css('background-image', 'url(' + ICONS.BLUE_24 + ')');
      _this
        .getInfo($(this).closest('.timeline__footer__controls'))
        .then(info => _this.getParamsToServer(info))
        .then(params => _this.send(params));
    });
  }

  onMouseEnter() {
    const _this = this;
    let timer = null;
    $(document).on(
      {
        mouseenter: function(e) {
          // HACK
          timer = setInterval(() => {
            _this.show($(this));
          }, 300);
        },
        mouseleave: function() {
          clearInterval(timer);
        },
      },
      this.container,
    );
  }
}
