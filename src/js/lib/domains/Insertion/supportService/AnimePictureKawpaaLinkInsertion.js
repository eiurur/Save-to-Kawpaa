import $ from 'jquery';
import { CONTENT_TYPE, ICONS, SUPPORT_SERVICE } from '../../../../config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class AnimePictureKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.ANIME_PICTURE_HOSTNAME);
    this.selector = '.post_vote_block #rating';
    this.html = `<a class="${
      this.kawpaaLinkClassName
    }" style="text-decoration: none; padding-left: 32px;" href="#">
    <span class="icon icon-kawpaa" style="display: inline-block; height: 24px; position: relative; top: 6px; width: 24px; background-image: url(${
      ICONS.GRAY_24
    });"></span>
    Save to Kawpaa</a>`;
  }

  getType() {
    const url = this.extraxtContentUrl();
    const pathname = new URL(url).pathname;
    const videoPattern = /(\.mp4|\.webm|\.avi)/;
    const isVideoContent = videoPattern.test(pathname);
    return isVideoContent ? CONTENT_TYPE.VIDEO : CONTENT_TYPE.IMAGE;
  }

  normalize(src) {
    return `https://${this.hostname}${src}`;
  }

  extraxtContentUrl() {
    const originalUrl = $('#big_preview_cont a').attr('href');
    const contentUrl = this.normalize(originalUrl);
    return contentUrl;
  }

  getUrl() {
    return this.extraxtContentUrl();
  }

  getParamsToServer() {
    return super.getParamsToServer({
      title: $('#big_preview').attr('alt'),
    });
  }
}
