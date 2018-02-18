import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class NijieKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.NIJIE_HOSTNAME);
    this.selector = '#view-center-button';
    this.html = `
    <ul id="view-center-left"">
      <li>
        <a href="#" class="kawpaa-save-link"
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

  getUrl() {
    return new Promise(resolve => {
      const srcUrl = $('#img_filter img').attr('src');
      return resolve(`https:${srcUrl}`);
    });
  }
}
