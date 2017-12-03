import $ from 'jquery';
import { targets } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class KomifloKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.KOMIFLO_HOSTNAME);
    this.selector = '.comic-preview-meta';
    this.html = `<a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getSrc() {
    return new Promise(resolve => {
      const srcUrl = $('.comic-cover img').attr('src');
      return resolve(srcUrl);
    });
  }
}
