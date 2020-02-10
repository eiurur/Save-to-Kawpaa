import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE_DOMAIN } from '../../../../config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

/**
 * yande.reには動画が存在しない
 */
export default class YandereKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.YANDE_RE_HOSTNAME);
    this.selector = '#right-col h4';
    this.html = `| <a class="${
      this.kawpaaLinkClassName
    }" href="#">Save to Kawpaa</a>`;
  }

  getUrl() {
    return new Promise(resolve => {
      // 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
      const largeImagesrc = $('#highres').attr('href');
      const viewingImageSrc = $('#image').attr('src');
      const url = largeImagesrc ? largeImagesrc : viewingImageSrc;
      return resolve(url);
    });
  }
}
