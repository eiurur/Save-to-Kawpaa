import $ from "jquery";
import Link from "./Link";

export default class KawpaaLinkInsertion extends Link {
  constructor(hostname) {
    super();
    this.hostname = hostname;
    this.onClickElement = ".kawpaa-save-link";
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

  getSrc() {}

  getParamsToServer(src) {
    return new Promise((resolve, reject) => {
      const params = {
        name: this.hostname,
        info: {
          type: "image",
          srcUrl: src
        }
      };
      return resolve(params);
    });
  }

  onClick() {
    $(document).on("click", this.onClickElement, e => {
      e.preventDefault();
      this.getSrc()
        .then(src => this.getParamsToServer(src))
        .then(params => this.send(params));
    });
  }

  send(params) {
    chrome.runtime.sendMessage(params, response => console.log(response));
  }
}
