import $ from 'jquery';
import { SUPPORT_SERVICE, ICONS } from '../../../../config/config';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

export default class NijiuraKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE.NIJIURA_HOSTNAME);

    this.hostname = document.domain; // 二次裏は掲示板ごとにサブドメインが異なるがDOM構造は同じなのでスクリプトは同一。ただしドメインが異なるのでわざわざ取得・代入。
    this.threadElement = '.thre';
    this.threadTextElement = 'blockquote:first';
    this.responseElement = '.rtd';
    this.responseTextElement = 'blockquote:first';
    this.imageElement = 'img:first';
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      const threadTitle = $(this.threadElement)
        .find(this.threadTextElement)
        .text();
      const responseText = targetElement.find(this.responseTextElement).text();
      const imageUrl = `http://${this.hostname}${targetElement
        .find(this.imageElement)
        .closest('a')
        .attr('href')}`;
      const info = {
        siteUrl: location.href,
        title: `${threadTitle} - ${responseText}`,
        srcUrl: imageUrl,
      };
      return resolve(info);
    });
  }

  show(_$, kawpaaButtonBasisPositionSelector) {
    const existKawpaaButton = _$.find(this.onClickElement).length !== 0;
    const hasPhoto = _$.find(this.imageElement).length > 0;
    if (existKawpaaButton || !hasPhoto) {
      return;
    }

    const html = `<span class="${
      this.kawpaaLinkClassName
    }" style="padding-left: 10px;
    font-size: 14px;
    cursor: pointer;">Save to Kawpaa</span>`;
    _$.find(kawpaaButtonBasisPositionSelector).after(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, async function(e) {
      e.preventDefault();

      const isRepsonse = $(this).closest(_this.responseElement).length > 0;
      let targetElement = isRepsonse
        ? $(this).closest(_this.responseElement)
        : $(this).closest(_this.threadElement);

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
      _this.responseElement,
    );

    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this), 'small:first');
        },
      },
      _this.threadElement,
    );
  }
}
