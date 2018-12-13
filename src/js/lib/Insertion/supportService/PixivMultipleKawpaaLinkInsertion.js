import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class PixivMultipleKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.PIXIV_HOSTNAME);
    this.selector = '[role="presentation"] [role="presentation"]';
    this.html = `
    <div class="${this.kawpaaLinkClassName}" >Save to Kawpaa</div>
    `;
    $('head').append(`
    <style type="text/css">
      .${this.kawpaaLinkClassName} {
        position: absolute;
        background: rgba(0,0,0,0.5);
        bottom: 0;
        color: white;
        left: 0;
        right: 0;
        padding: 16px;
        cursor: pointer;
        transition: all 0.5s ease;
      }
      .${this.kawpaaLinkClassName}:hover {
        color: #73d0da;
        background:  rgba(0,0,0,0.8);
      }
    </style>`);
  }

  onClick() {
    const _this = this;
    $(document).on('click', _this.onClickElement, function(e) {
      e.preventDefault();

      // FIXME: suprt.onClick()が使えない！
      // KawpaaLinkInsertion.jsを再利用
      Promise.all([
        _this.getType(),
        _this.getContent(),
        _this.getUrl($(this)),
        _this.getTitle(),
      ])
        .then(getedData => ({
          name: _this.hostname,
          info: {
            type: getedData[0],
            content: getedData[1],
            srcUrl: getedData[2], // TODO: urlだけに統一できない？
            url: getedData[2],
            title: getedData[3],
          },
        }))
        .then(params => _this.send(params));
    });
  }

  getTitle() {
    const title = $('head title').text();
    const tags = $.map($('figcaption footer ul li'), function(n, i) {
      return '#' + $(n).text();
    }).join(' ');
    return `${title} - ${tags}`;
  }

  getUrl(_$) {
    return new Promise(resolve => {
      const srcUrl = _$.closest(this.selector)
        .find('a')
        .attr('href');
      return resolve(srcUrl);
    });
  }
}
