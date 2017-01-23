const $ = require('jquery');
const {targets} = require('../../config');
const KawpaaLinkInsertion = require('../KawpaaLinkInsertion');

module.exports = class PixivKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.PIXIV_HOSTNAME);
    this.selector = '.bookmark-container';
    this.html = `<a href="#" class="add-bookmark _button kawpaa-save-link">Save to Kawpaa</a>`;
  }
  
  getSrc() {
    return new Promise((resolve) => {
      const srcUrl = $('.original-image').data('src');
      return resolve(srcUrl);
    });
  }
}