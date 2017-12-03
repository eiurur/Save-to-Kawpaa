import $ from 'jquery';
import Link from './Link';

export default class KawpaaLinkInsertion extends Link {
  constructor(hostname) {
    super();
    this.hostname = hostname;
    this.onClickElement = '.kawpaa-save-link';
    console.log(this);
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

  getSrc() {
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
      Promise.all([
        this.getType(),
        this.getContent(),
        this.getSrc(),
        this.getUrl(),
      ])
        .then(getedData =>
          this.getParamsToServer({
            type: getedData[0],
            content: getedData[1],
            src: getedData[2],
            url: getedData[3],
          }),
        )
        .then(params => this.send(params));
    });
  }

  send(params) {
    chrome.runtime.sendMessage(params, response => console.log(response));
  }
}
