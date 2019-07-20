import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE } from '../../../../config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class PixivKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.PIXIV_HOSTNAME);
    this.selector = 'figure section';
    this.html = `
    <div style="margin-right: 20px;" class="${
      this.kawpaaLinkClassName
    }"><button type="button" style="
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

  getTitle() {
    const title = $('head title').text();
    const tags = $.map($('figcaption footer ul li'), function(n, i) {
      return '#' + $(n).text();
    }).join(' ');
    return `${title} - ${tags}`;
  }

  getParamsToServer() {
    return Promise.all([
      this.getType(),
      this.getContent(),
      this.getUrl(),
      this.getTitle(),
    ]).then(getedData => ({
      name: this.hostname,
      info: {
        type: getedData[0],
        content: getedData[1],
        srcUrl: getedData[2], // TODO: urlだけに統一できない？
        url: getedData[2],
        title: getedData[3],
      },
    }));
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

      const srcUrl = ['.jpg', '.png'].includes(singleIllustSrcUrl)
        ? singleIllustSrcUrl
        : multiIllustSrcUrl;

      return resolve(srcUrl);
    });
    // return new Promise(resolve => {
    //   const illustSrcUrl = $('figure div[role="presentation"] a').attr('href');
    //   return resolve(illustSrcUrl);
    // });
  }
}
