import $ from 'jquery';
import QueryStringParser from '../utils/QueryStringParser';
import HTMLMetaDataScraper from './HTMLMetaDataScraper';
import { DEFAULT_IMAGE_URL } from '../../config/config';

export default class VideoScraper extends HTMLMetaDataScraper {
  constructor(data) {
    super(data);
    this.type = this.getType();
  }

  getType() {
    return 'video';
  }

  getContent() {
    return null;
  }

  /**
   * CAUTION: videoのときは動画のサムネイルを画像として保存する。動画のサムネイルの抽出はサーバサイドで行う
   */
  getURL() {
    return this.data.srcUrl;
  }

  getVideoURL() {
    return this.data.srcUrl;
  }
}
