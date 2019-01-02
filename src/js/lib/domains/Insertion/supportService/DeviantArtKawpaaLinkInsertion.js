import $ from 'jquery';
import { SUPPORT_SERVICE, ICONS } from '../../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class DeviantArtKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.DEVIANTART_HOSTNAME);
    this.selector = '.dev-meta-actions';

    // this.onChangeURL();
  }

  buildButton({ ext, width, height, imageUrl }) {
    this.html = `
    <a class='${
      this.kawpaaLinkClassName
    } dev-page-button dev-page-button-with-text dev-page-download' href='#' data-download_url='${imageUrl}'>
    <i style='background: url(${
      ICONS.BLUE_16
    }); background-position: none; background-repeat: no-repeat;'></i>
    <span class='label'>Save to Kawpaa</span>
    <span class='text'>${ext} ${width} x ${height}</span>
    </a>
    `;
  }

  extractImageInfo() {
    const img = $('.dev-view-deviation  .dev-content-full');
    const width = img.attr('width');
    const height = img.attr('height');
    const imageUrl = img.attr('src');

    const filename_ext = /.+\/(.+?)([\?#;].*)?$/;
    const filename = imageUrl.match(filename_ext)[1];
    const ext_reg = /(.*)(?:\.([^.]+$))/;
    const ext = filename.match(ext_reg)[2];

    return {
      ext: ext.toUpperCase(),
      width,
      height,
      imageUrl,
    };
  }

  insert() {
    const imageInfo = this.extractImageInfo();
    this.buildButton(imageInfo);
    super.insert();
    return this;
  }

  replace() {
    const hasKawpaaSaveLink = $('.kawpaa-save-link').length > 0;
    if (hasKawpaaSaveLink) {
      $('.kawpaa-save-link').remove();
    }
    const _this = this;
    setTimeout(() => {
      _this.insert();
    }, 1000);
  }

  onChangeURL() {
    const _this = this;
    setInterval(() => {
      _this.replace();
    }, 1000);
  }

  getUrl() {
    return new Promise(resolve => {
      const srcUrl = $('.dev-view-deviation  .dev-content-full').attr('src');
      return resolve(srcUrl);
    });
  }
}
