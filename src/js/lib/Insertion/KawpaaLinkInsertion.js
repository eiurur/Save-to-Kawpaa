import $ from 'jquery';
import Link from './Link';

export default class KawpaaLinkInsertion extends Link {
  constructor(hostname) {
    super();
    this.hostname = hostname;
    this.onClickElement = '.kawpaa-save-link';
    console.log(this);
  }

  wait(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  insert() {
    $(document)
      .find(this.selector)
      .append(this.html);
    return this;
  }

  on() {
    this.onClick();
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

  getParamsToServer({ type, content, src, url }) {
    return new Promise((resolve, reject) => {
      const params = {
        name: this.hostname,
        info: {
          type: type,
          content: content,
          srcUrl: src,
          url: url,
        },
      };
      return resolve(params);
    });
  }

  onClick() {
    $(document).on('click', this.onClickElement, e => {
      e.preventDefault();
      Promise.all([this.getType(), this.getContent(), this.getUrl()])
        .then(getedData =>
          this.getParamsToServer({
            type: getedData[0],
            content: getedData[1],
            srcUrl: getedData[2], // TODO: urlだけに統一できない？
            url: getedData[2],
          }),
        )
        .then(params => this.send(params));
    });
  }

  send(params) {
    chrome.runtime.sendMessage(params, response => console.log(response));
  }
}
