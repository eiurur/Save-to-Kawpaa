import $ from 'jquery';
import QueryStringParser from '../utils/QueryStringParser';
import HTMLMetaDataScraper from './HTMLMetaDataScraper';
import { DEFAULT_IMAGE_URL } from '../../config/';

export default class TextScraper extends HTMLMetaDataScraper {
  constructor(data) {
    super(data);
    this.type = this.getType();
  }

  getType() {
    return 'text';
  }

  getContent() {
    const content = this.data.selectionText
    delete this.data.selectionText;

    const selectedElement = window.getSelection().getRangeAt(0);
    const startParentElement = selectedElement.startContainer.parentElement;
    const endParentElement = selectedElement.endContainer.parentElement;
    const $start = $(startParentElement);
    const $end = $(endParentElement);

    if (startParentElement === endParentElement) {
      return this.removeScriptTag();
    } else {
      // jquery - get a common parent for two DOM elements - Stack Overflow
      // https://stackoverflow.com/questions/7647864/get-a-common-parent-for-two-dom-elements
      const $commonParent = $start
        .parents()
        .has(endParentElement)
        .first();
      return this.removeScriptTag($commonParent.html());
    }
    return content;
  }

  /**
   * CAUTION: textのときは必ずスクリーンショットを画像として保存する。スクリーンショットの撮影はサーバサイドで行う
   */
  getURL() {
    return DEFAULT_IMAGE_URL;
  }
}
