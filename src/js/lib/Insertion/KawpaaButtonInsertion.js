import $ from 'jquery';
import Button from './Button';

export default class KawpaaButtonInsertion extends Button {
  constructor(hostname) {
    super();
    this.hostname = hostname;
    this.onClickElement = `.kawpaa-save-link_${new Date().getTime()}`;
    this.kawpaaLinkClassName = this.onClickElement.replace('.', '');
  }

  getInfo() {}

  getParamsToServer(info) {
    return new Promise((resolve, reject) => {
      const params = {
        name: this.hostname,
        info: Object.assign(
          {
            type: 'image',
          },
          info,
        ),
      };
      return resolve(params);
    });
  }

  send(params) {
    chrome.runtime.sendMessage(params, response => console.log(response));
  }

  on() {
    this.onClick();
    this.onMouseEnter();
  }

  onClick() {
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();
    });
  }

  onMouseEnter() {
    const _this = this;
    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this));
        },
      },
      _this.container,
    );
  }
}
