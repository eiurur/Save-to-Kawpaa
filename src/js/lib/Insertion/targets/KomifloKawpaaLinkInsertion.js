const $ = require('jquery');
const {targets} = require('../../config');
const KawpaaLinkInsertion = require('../KawpaaLinkInsertion');

module.exports = class KomifloKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.KOMIFLO_HOSTNAME);
    this.selector = '.comic-preview-meta .module:eq(2)';
    this.html = `<a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getSrc() {
    return new Promise((resolve) => {
      const srcUrl = $('.content-undefined-button img').attr('src');
      return resolve(srcUrl);
    });
  }
}