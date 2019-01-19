import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE } from '../../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class SankakuComplexKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.SANKAKUCOMPLEX_HOSTNAME);
    this.selector = '#share';
    this.html = `<h3><a class="${
      this.kawpaaLinkClassName
    }" href="#">Save to Kawpaa</a></h3>`;
  }

  expandImage() {
    return new Promise(resolve => {
      // loadイベントだと読み込み待ちが発生する。
      $('#image').on('click', async e => {
        // 少し待たないと<img>のsrcがabout:blankでサーバに送信してしまい、データの保存に失敗する。
        await this.wait(500);
        return resolve();
      });
      $('#image').click();
    });
  }

  extraxtContentUrl() {
    const originalUrl = $('#image').attr('src');
    const contentUrl = this.normalize(originalUrl);
    return contentUrl;
  }

  async getType() {
    await this.expandImage();
    const url = this.extraxtContentUrl();
    const pathname = new URL(url).pathname;
    const videoPattern = /(\.mp4|\.webm|\.avi)/;
    const isVideoContent = videoPattern.test(pathname);
    return isVideoContent ? CONTENT_TYPE.VIDEO : CONTENT_TYPE.IMAGE;
  }

  // TODO: いつか不要になる。後で消す。
  normalize(src) {
    return /^https?:\/\//.test(src) ? src : `https:${src}`;
  }

  async getUrl() {
    await this.expandImage();
    const contentUrl = this.extraxtContentUrl();
    return contentUrl;
  }
}
