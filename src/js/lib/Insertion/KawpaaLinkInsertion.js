import $ from 'jquery';
import Link from './Link';

export default class KawpaaLinkInsertion extends Link {
  constructor(hostname) {
    super();
    this.hostname = hostname;
    this.onClickElement = `.kawpaa-save-link_${new Date().getTime()}`;
    this.kawpaaLinkClassName = this.onClickElement.replace('.', '');
  }

  wait(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  exist() {
    return $(this.selector).length > 0;
  }

  /**
   * リンクの設置の数に関係なくclickイベントの登録処理が走ってしまうので
   * 挿入のときに制御する必要が生じた。
   * → 追加に成功したらtrue, 失敗したらfalseを返す。
   */
  async insert() {
    await this.wait(1000); // 動的生成サイト対策
    const existKawpaaLink = $(`[class^="kawpaa-save-link"]`).length > 0;
    if (existKawpaaLink) return false;

    $(document)
      .find(this.selector)
      .append(this.html);

    return true;
  }

  on() {
    this.onClick();
  }

  off() {
    this.offClick();
  }

  getType() {
    return 'image';
  }

  getContent() {
    return null;
  }

  getUrl() {
    return null;
  }

  getParamsToServer() {
    return Promise.all([this.getType(), this.getContent(), this.getUrl()]).then(
      getedData => ({
        name: this.hostname,
        info: {
          type: getedData[0],
          content: getedData[1],
          srcUrl: getedData[2], // TODO: urlだけに統一できない？
          url: getedData[2],
        },
      }),
    );
  }

  onClick() {
    $(document).on('click', this.onClickElement, e => {
      e.preventDefault();
      this.getParamsToServer().then(params => this.send(params));
    });
  }

  offClick() {
    $(document).off('click', this.onClickElement);
  }

  send(params) {
    chrome.runtime.sendMessage(params, response => console.log(response));
  }
}
