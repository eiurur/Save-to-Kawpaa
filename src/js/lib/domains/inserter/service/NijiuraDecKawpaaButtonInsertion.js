import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE, ICONS } from '../../../../config';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

export default class NijiuraDecKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE.NIJIURA_DECK_HOSTNAME);

    this.hostname = document.domain; // 二次裏は掲示板ごとにサブドメインが異なるがDOM構造は同じなのでスクリプトは同一。ただしドメインが異なるのでわざわざ取得・代入。
    this.mouseenter = '.res';
    this.threadTextElement = 'blockquote:first';
    this.responseElement = '.res';
    this.responseTextElement = 'blockquote:first';
    this.imageElement = 'img';
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      const threadTitle = $(targetElement)
        .closest('.column-scroller')
        .find('.response-text')
        .first()
        .text();
      const responseText = targetElement.find('.response-text').text();
      const srcUrl = targetElement
        .find('[data-orig]')
        .attr('data-orig')
        .replace('thumb', 'src')
        .replace(/(\d+)s/, '$1');
      const info = {
        type: this.getType(srcUrl),
        siteUrl: location.href,
        title: `${threadTitle} - ${responseText}`,
        srcUrl: srcUrl,
      };
      console.log(info);
      return resolve(info);
    });
  }

  getType(url) {
    const pathname = new URL(url).pathname;
    const videoPattern = /(\.mp4|\.webm|\.avi)/;
    const isVideoContent = videoPattern.test(pathname);
    return isVideoContent ? CONTENT_TYPE.VIDEO : CONTENT_TYPE.IMAGE;
  }

  show(_$) {
    const existKawpaaButton = _$.find(this.onClickElement).length !== 0;
    const hasPhoto = !!_$.find(this.imageElement).attr('src');
    console.log(_$, existKawpaaButton, hasPhoto);
    if (existKawpaaButton || !hasPhoto) {
      return;
    }

    const html = `<div class="${this.kawpaaLinkClassName}" style="
    padding: 10px 0;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    color: #409eff;">Save to Kawpaa</div>`;
    _$.append(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, async function(e) {
      e.preventDefault();

      const targetElement = $(this).closest(_this.responseElement);
      const info = await _this.getInfo(targetElement);
      const paramters = await _this.getParamsToServer(info);
      _this.send(paramters);
    });
  }

  onMouseEnter() {
    const _this = this;
    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this), 'small');
        },
      },
      _this.mouseenter,
    );
  }
}
