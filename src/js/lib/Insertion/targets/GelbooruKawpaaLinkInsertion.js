import $ from 'jquery';
import { targets } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class GelbooruKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.GELBOORU_HOSTNAME);
    this.selector = '#right-col h4';
    this.html = `| <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getUrl() {
    return new Promise(resolve => {
      const srcUrl = $('#image').attr('src');
      return resolve(this.normalize(srcUrl));
    });
  }

  normalize(src) {
    return `https:${src}`;
  }
}
