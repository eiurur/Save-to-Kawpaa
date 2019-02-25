import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE } from '../../../../config/';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class KonachanKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.KONACHAN_HOSTNAME);
    this.selector = '#right-col h4';
    this.html = `| <a class="${
      this.kawpaaLinkClassName
    }" href="#">Save to Kawpaa</a>`;
  }

  extraxtContentUrl() {
    const originalUrl = $('#image').attr('src');
    const conetntUrl = this.normalize(originalUrl);
    return originalUrl;
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
