import $ from "jquery";
import { targets } from "../../config";
import KawpaaLinkInsertion from "../KawpaaLinkInsertion";

export default class GelbooruKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.GELBOORU_HOSTNAME);
    this.selector = "#right-col h4";
    this.html = `| <a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getSrc() {
    return new Promise(resolve => {
      const srcUrl = $("#image").attr("src");
      return resolve(srcUrl);
    });
  }
}
