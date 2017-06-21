import $ from "jquery";
import { targets } from "../../config";
import KawpaaLinkInsertion from "../KawpaaLinkInsertion";

export default class PixivMultipleKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.PIXIV_HOSTNAME);
    this.selector = ".item-container";
    this.html = `\
      <div style="font-size: 2em;">
        <a href="#" class="kawpaa-save-link">Save to Kawpaa</a>
      </div>\
    `;
  }

  onClick() {
    const _this = this;
    $(document).on("click", _this.onClickElement, function(e) {
      e.preventDefault();
      _this
        .getSrc($(this))
        .then(src => _this.getParamsToServer(src))
        .then(params => _this.send(params));
    });
  }

  getSrc(_$) {
    return new Promise(resolve => {
      const srcUrl = _$.closest(this.selector).find(".image").data("src");
      return resolve(srcUrl);
    });
  }
}
