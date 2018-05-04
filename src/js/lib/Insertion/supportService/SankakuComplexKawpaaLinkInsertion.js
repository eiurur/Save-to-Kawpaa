import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class SankakuComplexKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.SANKAKUCOMPLEX_HOSTNAME);
    this.selector = '#share';
    this.html = `<h3><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></h3>`;
  }

  getUrl() {
    return new Promise(resolve => {
      // loadイベントだと読み込み待ちが発生する。
      $('#image').on('click', async e => {
        // 少し待たないと<img>のsrcがabout:blankでサーバに送信してしまい、データの保存に失敗する。
        await this.wait(500);
        const originalImageSrc = $('#image').attr('src');
        const srcUrl = /^https?:\/\//.test(originalImageSrc)
          ? originalImageSrc
          : `https:${originalImageSrc}`;
        return resolve(srcUrl);
      });
      $('#image').click();
    });
  }
}
