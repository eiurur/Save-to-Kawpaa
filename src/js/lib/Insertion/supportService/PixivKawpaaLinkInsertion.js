import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class PixivKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.PIXIV_HOSTNAME);
    this.selector = 'figure .sticky section';
    this.html = `
    <div style="margin-right: 20px;" class="kawpaa-save-link"><button type="button" style="
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    display: inline-block;
    font-weight: 700;
    height: 32px;
    line-height: 32px;
    padding: 0;
    "><span style="vertical-align: middle;">Save to Kawpaa</span></button></div>`;
  }

  //  <a href="#" class="_bookmark-toggle-button add-bookmark kawpaa-save-link">Save to Kawpaa</a>`;
  getUrl() {
    return new Promise(resolve => {
      // single
      const singleIllustSrcUrl = $('figure div[role="presentation"] a').attr(
        'href',
      );

      // multi
      const multiIllustSrcUrl = $('figure div[role="presentation"] a img').attr(
        'src',
      );

      // FIXME: とりあえず画像拡張子の有無で画像URLかページURLか判定する。
      const srcUrl = ['.jpg', '.png'].includes(singleIllustSrcUrl)
        ? singleIllustSrcUrl
        : multiIllustSrcUrl;

      return resolve(srcUrl);
    });
  }
}
