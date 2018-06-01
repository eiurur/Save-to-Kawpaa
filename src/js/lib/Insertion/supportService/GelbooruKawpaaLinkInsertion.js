import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class GelbooruKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.GELBOORU_HOSTNAME);
    this.selector = '#right-col h4';
    this.html = `| <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  extraxtContentUrl() {
    const originalUrl = $('#image').attr('src');
    const contentUrl = this.normalize(originalUrl);
    return contentUrl;
  }

  getType() {
    const contentUrl = this.extraxtContentUrl();
    const pathname = new URL(contentUrl).pathname;
    const videoPattern = /(.mp4|.webm|.avi)/;
    const isVideoContents = videoPattern.test(pathname);

    if (isVideoContents) {
      return 'video';
    } else {
      return 'image';
    }
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
