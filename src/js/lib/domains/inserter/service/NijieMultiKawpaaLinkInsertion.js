import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE_DOMAIN } from '../../../../config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class NijieMultiKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.NIJIE_HOSTNAME);
    this.selector = '.illust_click_a';
    this.html = `
      <div style="font-size: 1.5rem; padding: 1rem 0;">
        <a href="#" class="${this.kawpaaLinkClassName}">Save to Kawpaa</a>
      </div>
    `;
    this.$content = null;
  }

  // PixivMultiKawpaaLinkInsertionから流用
  onClick() {
    const _this = this;
    $(document).on('click', _this.onClickElement, function(e) {
      e.preventDefault();

      _this.$content = $(this);

      // FIXME: suprt.onClick()が使えない！
      // KawpaaLinkInsertion.jsを再利用
      Promise.all([_this.getType(), _this.getContent(), _this.getUrl()])
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

  extraxtContentUrl() {
    const imgUrl = this.$content
      .closest(this.selector)
      .find('#img_filter img')
      .attr('src');
    const videoUrl = this.$content
      .closest(this.selector)
      .find('video')
      .attr('src');
    const srcUrl = imgUrl || videoUrl;
    const contentUrl = this.normalize(srcUrl);
    return contentUrl;
  }

  getType() {
    const url = this.extraxtContentUrl();
    const pathname = new URL(url).pathname;
    const videoPattern = /(\.mp4|\.webm|\.avi)/;
    const isVideoContent = videoPattern.test(pathname);
    return isVideoContent ? CONTENT_TYPE.VIDEO : CONTENT_TYPE.IMAGE;
  }

  // TODO: いつか不要になる。後で消す。
  normalize(src) {
    return src.includes('https:') ? src : `https:${src}`;
  }

  getUrl() {
    return new Promise(resolve => {
      const contentUrl = this.extraxtContentUrl();
      return resolve(contentUrl);
    });
  }
}
