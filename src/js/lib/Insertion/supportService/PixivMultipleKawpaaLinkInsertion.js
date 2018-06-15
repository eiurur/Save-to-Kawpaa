import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class PixivMultipleKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.PIXIV_HOSTNAME);
    this.selector = '.item-container';
    this.html = `\
      <div style="font-size: 2em;">
        <a href="#" class="${this.kawpaaLinkClassName}">Save to Kawpaa</a>
      </div>\
    `;
  }

  onClick() {
    const _this = this;
    $(document).on('click', _this.onClickElement, function(e) {
      e.preventDefault();

      // FIXME: suprt.onClick()が使えない！
      // KawpaaLinkInsertion.jsを再利用
      Promise.all([_this.getType(), _this.getContent(), _this.getUrl($(this))])
        .then(getedData => ({
          name: _this.hostname,
          info: {
            type: getedData[0],
            content: getedData[1],
            srcUrl: getedData[2], // TODO: urlだけに統一できない？
            url: getedData[2],
          },
        }))
        .then(params => _this.send(params));
    });
  }

  getUrl(_$) {
    return new Promise(resolve => {
      const srcUrl = _$.closest(this.selector)
        .find('.image')
        .data('src');
      return resolve(srcUrl);
    });
  }
}
