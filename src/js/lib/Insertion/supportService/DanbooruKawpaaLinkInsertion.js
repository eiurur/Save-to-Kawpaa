import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class DanbooruKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.DANBOORU_HOSTNAME);
    this.selector = '#post-sections';
    this.html = `<li><a class="${
      this.kawpaaLinkClassName
    }" href="#">Save to Kawpaa</a></li>`;
  }

  extraxtContentUrl() {
    const sampleUrl = $('#image').attr('src');
    const originalUrl = sampleUrl.replace('sample/sample-', '');
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

  normalize(src) {
    return /^https?:\/\//.test(src) ? src : `https://danbooru.donmai.us${src}`;
  }

  getUrl() {
    return new Promise(resolve => {
      const contentUrl = this.extraxtContentUrl();
      return resolve(contentUrl);
    });
  }
}
