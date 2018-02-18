import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class NijieMultiKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.NIJIE_HOSTNAME);
    this.selector = '.illust_click_a';
    this.html = `
      <div style="font-size: 1.5rem; padding: 1rem 0;">
        <a href="#" class="kawpaa-save-link">Save to Kawpaa</a>
      </div>
    `;
  }

  // PixivMultiKawpaaLinkInsertionから流用
  onClick() {
    const _this = this;
    $(document).on('click', _this.onClickElement, function(e) {
      e.preventDefault();

      // FIXME: suprt.onClick()が使えない！
      // KawpaaLinkInsertion.jsを再利用
      Promise.all([_this.getType(), _this.getContent(), _this.getUrl($(this))])
        .then(getedData =>
          _this.getParamsToServer({
            type: getedData[0],
            content: getedData[1],
            srcUrl: getedData[2], // TODO: urlだけに統一できない？
            url: getedData[2],
          }),
        )
        .then(params => _this.send(params));
    });
  }

  getUrl(_$) {
    return new Promise(resolve => {
      const srcUrl = _$.closest(this.selector)
        .find('#img_filter img')
        .attr('src');
      return resolve(`https:${srcUrl}`);
    });
  }
}
