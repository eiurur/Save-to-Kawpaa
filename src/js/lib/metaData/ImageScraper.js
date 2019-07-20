import $ from 'jquery';
import QueryStringParser from '../utils/QueryStringParser';
import HTMLMetaDataScraper from './HTMLMetaDataScraper';

export default class ImageScraper extends HTMLMetaDataScraper {
  constructor(data) {
    super(data);
    this.type = this.getType();
  }

  getType() {
    return 'image';
  }

  getContent() {
    return null;
  }

  getURL() {
    if (this.data.srcUrl.indexOf('https://pbs.twimg.com/media/') !== -1) {
      this.data.srcUrl = this.data.srcUrl.replace(/name=(.*)/, 'name=orig');
    }
    return this.data.srcUrl;
  }
}
