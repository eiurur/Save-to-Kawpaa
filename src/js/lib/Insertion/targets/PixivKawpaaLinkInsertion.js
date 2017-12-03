import $ from 'jquery';
import { targets } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class PixivKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.PIXIV_HOSTNAME);
    this.selector = '.bookmark-container';
    this.html = `<a href="#" class="_bookmark-toggle-button add-bookmark kawpaa-save-link">Save to Kawpaa</a>`;
  }

  getSrc() {
    return new Promise(resolve => {
      const srcUrl = $('.original-image').data('src');
      return resolve(srcUrl);
    });
  }
}
