import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE_DOMAIN } from '../../../../config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class PixivNovelKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.PIXIV_HOSTNAME);
    this.selector = 'main > section > div:eq(1)';
    this.html = `
    <div class="${this.kawpaaLinkClassName}" >Save to Kawpaa</div>
    `;
    this.insertStyle();
  }
  insertStyle() {
    $('head').append(`
    <style type="text/css">
      .${this.kawpaaLinkClassName} {
        position: fixed;
        background: rgba(0,0,0,0.3);
        color: white;
        left: 1rem;
        bottom: 1rem;
        padding: .5rem 1.5rem;
        border-radius: 60rem;
        cursor: pointer;
        text-align: center;
        z-index: 10000;
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
    $(document).on('click', _this.onClickElement, function (e) {
      e.preventDefault();

      // FIXME: suprt.onClick()が使えない！
      // KawpaaLinkInsertion.jsを再利用
      Promise.all([
        _this.getType(),
        _this.getContent(),
        _this.getUrl($(this)),
        _this.getTitle(),
      ])
        .then((getedData) => ({
          name: _this.hostname,
          info: {
            type: getedData[0],
            content: getedData[1],
            srcUrl: getedData[2], // TODO: urlだけに統一できない？
            url: getedData[2],
            title: getedData[3],
          },
        }))
        .then((params) => _this.send(params));
    });
  }
  getType() {
    return CONTENT_TYPE.TEXT;
  }
  
  getNovelText() {
    return this.getVerticalWritingText() || this.getHorizontalWritingText()
  }

  getVerticalWritingText() {
    return $(`${this.selector} > div:eq(1) > div:eq(0) > div:eq(1)`).html()
  }

  getHorizontalWritingText() {
    return $(`${this.selector} > div:eq(1) > div:eq(0) > div:eq(0)`).html()
  }

  getContent() {
    let content = '';
    const btns = $(`${this.selector} nav:first button[type="button"]`)
    if(btns.length) {
      $.each(btns, (i, btn) => {
        if(i === 0 || i === (btns.length-1)) return
        $(btn).trigger('click')
        content += this.getNovelText()
      })
    }
    else {
      content = this.getNovelText()
    }
    return content;
  }

  getTitle() {
    return document.title;
  }

  getUrl(_$) {
    return new Promise((resolve) => {
      const srcUrl = null;
      return resolve(srcUrl);
    });
  }
}
