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
    if (this.data.srcUrl.indexOf('https://pbs.twimg.com/media/') !== -1) {
      this.data.srcUrl = this.data.srcUrl.replace(/name=(.*)/, 'name=large');
    }
    return this.data.srcUrl;
  }
}
