import $ from 'jquery';
import { targets } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class YandereKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.YANDE_RE_HOSTNAME);
    this.selector = '#right-col h4';
    this.html = `| <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getSrc() {
    return new Promise(resolve => {
      // 個人的にsampleサイズでも十分に感じるため大きいサイズに変換する処理は行わない。
      const originalImageSrc = $('#image').attr('src');
      const url = originalImageSrc;
      return resolve(url);
    });
  }
}
