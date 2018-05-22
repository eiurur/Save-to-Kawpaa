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
    return this.data.srcUrl;
  }
}
