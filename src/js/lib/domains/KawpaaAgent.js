import MetaDataScraperFactory from '../metaData/MetaDataScraperFactory';
import KawpaaSender from './KawpaaSender';

export default class KawpaaAgent {
  constructor(token) {
    this.token = token;
    this.postData = {};
  }

  validate() {
    if (!this.token)
      throw new Error(
        'トークンが未登録です。<br> 拡張機能のオプションページでトークンを登録してください',
      );
  }

  setPostData(info = {}) {
    const scraper = MetaDataScraperFactory.create(info);
    const htmlMetaData = scraper.scrape(info);
    this.postData = Object.assign(htmlMetaData, info);
  }

  /**
   * メタデータをKawpaaサーバに送信＋保存
   */
  async register() {
    const payload = {
      token: this.token,
      post: this.postData,
    };
    const sender = new KawpaaSender(payload);
    await sender.save();
  }
}
