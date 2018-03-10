import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class DanbooruKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.DANBOORU_HOSTNAME);
    this.selector = '#post-sections';
    this.html = `<li><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></li>`;
  }

  getUrl() {
    return new Promise(resolve => {
      const imgUrl =
        $('#image-resize-link').attr('href') || $('#image').attr('src');
      const originalImageSrc = imgUrl.replace('sample/sample-', '');
      const url = originalImageSrc.includes('https://')
        ? originalImageSrc
        : `https://danbooru.donmai.us${originalImageSrc}`;
      return resolve(url);
    });
  }
}
