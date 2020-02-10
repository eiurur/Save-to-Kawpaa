import $ from 'jquery';
import { CONTENT_TYPE, SUPPORT_SERVICE_DOMAIN } from '../../../../config/';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class KomifloKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE_DOMAIN.KOMIFLO_HOSTNAME);
    this.selector = '.comic-preview-meta';
    this.html = `<a class="${
      this.kawpaaLinkClassName
    }" href="#">Save to Kawpaa</a>`;
  }

  getUrl() {
    return new Promise(resolve => {
      const srcUrl = $('.comic-cover img').attr('src');
      return resolve(srcUrl);
    });
  }
}
