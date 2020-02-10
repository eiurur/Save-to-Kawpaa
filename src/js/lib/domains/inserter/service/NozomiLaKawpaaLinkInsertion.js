import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE_DOMAIN } from '../../../../config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class NozomiLaKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.NOZOMI_LA_HOSTNAME);
    this.selector = '.sidebar';
    this.html = `<span class="title">Kawpaa</span>
    <ul>
    <li>
    <a class="${this.kawpaaLinkClassName}" href="#">Save to Kawpaa</a>
    </li>
</ul>`;
  }

  async insert() {
    await this.wait(1000); // 動的生成サイト対策
    const existKawpaaLink = $(`[class^="kawpaa-save-link"]`).length > 0;
    if (existKawpaaLink) return false;

    $(document)
      .find(this.selector)
      .prepend(this.html);

    return true;
  }

  getType() {
    const url = this.extraxtContentUrl();
    const pathname = new URL(url).pathname;
    const videoPattern = /(\.mp4|\.webm|\.avi)/;
    const isVideoContent = videoPattern.test(pathname);
    return isVideoContent ? CONTENT_TYPE.VIDEO : CONTENT_TYPE.IMAGE;
  }

  normalize(src) {
    return `https:${src}`;
  }

  extraxtContentUrl() {
    const originalUrl = $('.post a').attr('href');
    const contentUrl = this.normalize(originalUrl);
    return contentUrl;
  }

  getUrl() {
    return this.extraxtContentUrl();
  }

  getParamsToServer() {
    return super.getParamsToServer({
      title: $('.post img').attr('alt'),
    });
  }
}
