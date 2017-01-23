const $ = require('jquery');
const {targets} = require('../../config');
const KawpaaLinkInsertion = require('../KawpaaLinkInsertion');

module.exports = class KonachanKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.KONACHAN_HOSTNAME);
    this.selector = '#right-col h4';
    this.html = `| <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }
  
  getSrc() {
    return new Promise((resolve) => {
      const srcUrl = $('#image').attr('src');
      return resolve(srcUrl);
    });
  }
}