import $ from "jquery";
import { targets, icons } from "../../config";
import KawpaaLinkInsertion from "../KawpaaLinkInsertion";

export default class DeviantArtKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.DEVIANTART_HOSTNAME);
    this.selector = ".dev-meta-actions";
    this.html = `\
      <a class="dev-page-button dev-page-button-with-text dev-page-download kawpaa-save-link" href="#" data-download_url="http://www.deviantart.com/download/460347620/gochiusa_by_azizkeybackspace-d7m2uhw.png?token=a6e80ce8b02c8c1dc7762417c29bf3d3b57bd13d&amp;ts=1458132778">
      <i style="background: url(${icons.BLUE_16}); background-position: none; background-repeat: no-repeat;"></i>
      <span class="label">Save to Kawpaa</span>
      </a>\
    `;

    this.onChangeURL();
  }

  onChangeURL() {
    $(document).on("change", "data-deviationid", () => {
      const sampleImgUrl = $(this).attr("src");
      return console.log("sampleImgUrl = ", sampleImgUrl);
    });
  }

  getSrc() {
    return new Promise(resolve => {
      const srcUrl = $(".dev-content-full").attr("src");
      return resolve(srcUrl);
    });
  }
}
