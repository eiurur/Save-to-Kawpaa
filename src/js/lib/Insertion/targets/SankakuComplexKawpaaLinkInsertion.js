const $ = require('jquery');
const {targets} = require('../../config');
const KawpaaLinkInsertion = require('../KawpaaLinkInsertion');

module.exports = class SankakuComplexKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.SANKAKUCOMPLEX_HOSTNAME);
    this.selector = '#share';
    this.html = `<a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getSrc() {
    return new Promise((resolve) => {
      $('#image').on('click', function(e) {
        const originalImageSrc = $('#image').attr('src');
        const srcUrl = `https:${originalImageSrc}`;
        return resolve(srcUrl);
      });
      $('#image').click();
    });
  }
}