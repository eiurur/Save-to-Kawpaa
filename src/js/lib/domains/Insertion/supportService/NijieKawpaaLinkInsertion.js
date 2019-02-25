import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE } from '../../../../config/';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class NijieKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.NIJIE_HOSTNAME);
    this.selector = '#view-center-button';
    this.html = `
    <ul id="view-center-left"">
      <li>
        <a href="#" class="${this.kawpaaLinkClassName}"
          style="text-align: center; font-size: 12px; padding: 10px 7px 13px; font-weight: bold; text-decoration: none; color: #fff; display: block; width: 128px; border-radius: 30px; background: #73d0da; box-shadow: 0 -3px 0 #2e9ba7 inset; text-shadow: -1px -1px 0 rgba(0,0,0,0.4);">
          Save to Kawpaa</a>
      </li>
    </ul>`;

    this.preprocess();
  }

  preprocess() {
    // Buttonを表示させた際に、styleが崩れないようコンテナの横幅を広げる
    $('#view-center-button').css('width', '90%');
  }

  extraxtContentUrl() {
    const imgUrl = $('#img_filter img').attr('src');
    const videoUrl = $('#img_filter video').attr('src');
    const srcUrl = imgUrl || videoUrl;
    const contentUrl = this.normalize(srcUrl);
    return contentUrl;
  }

  getType() {
    const contentUrl = this.extraxtContentUrl();
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
