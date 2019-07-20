import $ from 'jquery';

export default class KawpaaButtonInsertion {
  constructor(hostname) {
    this.hostname = hostname;
    this.onClickElement = `.kawpaa-save-link_${new Date().getTime()}`;
    this.kawpaaLinkClassName = this.onClickElement.replace('.', '');
  }

  insert() {
    return this;
  }

  show() {
    return this;
  }

  getInfo() {}

  getParamsToServer(info = {}) {
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

  exist() {
    return $(this.selector).length > 0;
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
