const $ = require('jquery');
const Button = require('./Button');

module.exports = class KawpaaButtonInsertion extends Button {
  constructor(hostname) {
    super();
    this.hostname = hostname;
    this.onClickElement = '.kawpaa-save-link';
  }


  insert() {
    return this;
  }

  on() {
    this.onClick();
    this.onMouseEnter();
  }

  getInfo() {
    
  }

  show() {

  }

  getParamsToServer(info) {
    return new Promise((resolve, reject) => {
      const params = {
        name: this.hostname,
        info: Object.assign(info, {
          type: 'image',
        })
      };
      return resolve(params);
    });
  }

  onClick() {
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();
    })
  }

  onMouseEnter() {
    const _this = this;
    $(document).on({
      'mouseenter': function(e) {
        _this.show($(this))
      }
    }, _this.container);
  }

  send(params) {
    chrome.runtime.sendMessage(params, (response) => console.log(response) )
  }

}