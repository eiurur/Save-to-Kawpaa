import HTMLMetaDataScraper from './HTMLMetaDataScraper';
import { CONTENT_TYPE } from '../../config';

export default class ImageScraper extends HTMLMetaDataScraper {
  constructor(data) {
    super(data);
    this.type = this.getType();
  }

  getType() {
    return CONTENT_TYPE.IMAGE;
  }

  getContent() {
    return null;
  }

  getURL() {
    return this.data.srcUrl;
  }
}
