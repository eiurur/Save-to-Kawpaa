import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class KomifloKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.KOMIFLO_HOSTNAME);
    this.selector = '.comic-preview-meta';
    this.html = `<a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getUrl() {
    return new Promise(resolve => {
      const srcUrl = $('.comic-cover img').attr('src');
      return resolve(srcUrl);
    });
  }
}
