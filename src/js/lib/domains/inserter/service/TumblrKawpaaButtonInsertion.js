import $ from 'jquery';
import { SUPPORT_SERVICE_DOMAIN, ICONS } from '../../../../config';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

export default class TumblrKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.TUMBLR_HOSTNAME);

    this.container = '.post_wrapper';
    this.post_container = '.post';
    this.textElement = '.post_body';
    this.imageElement = '.post_media_photo';
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      const info = {
        siteUrl: targetElement.find('.post_permalink').attr('href'),
        title: `${targetElement
          .find(this.textElement)
          .text()} ${targetElement.find('.post_permalink').attr('href')}`,
        srcUrl:
          targetElement.find('.high_res_link').data('big-photo') ||
          targetElement.find('.post_media_photo').attr('src'),
      };
      console.log(info);
      return resolve(info);
    });
  }

  show(_$, SUPPORT_SERVICEelector) {
    const existKawpaaButton = _$.find(this.onClickElement).length !== 0;
    const hasPhoto = _$.find(this.imageElement).length > 0;
    if (existKawpaaButton || !hasPhoto) {
      return;
    }

    const html = `<div class="${
      this.kawpaaLinkClassName
    } post_control post-control-icon icon-kawpaa" title="Save to Kawpaa" data-subview="Save to Kawpaa" style="background-image: url(${
      ICONS.GRAY_24
    });"></div>`;
    _$.find(SUPPORT_SERVICEelector).append(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this).css('background-image', `url(${ICONS.BLUE_24})`);

      let $postWrapper = $(this).closest(_this.container);
      let $post = $(this).closest(_this.post_container);

      // Hack: 拡張性なし
      let nowPageVariable = $postWrapper.length > 0 ? 'dashboard' : undefined;

      var targetElement = null;
      switch (nowPageVariable) {
        case 'dashboard':
          targetElement = $postWrapper;
          break;
        default:
          // sidebar
          targetElement = $post;
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
          _this.show($(this), '.post_controls_inner');
        },
      },
      _this.container,
    );

    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this), '.post_controls');
        },
      },
      _this.post_container,
    );
  }
}
