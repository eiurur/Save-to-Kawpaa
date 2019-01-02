import $ from 'jquery';
import QueryStringParser from '../utils/QueryStringParser';

export default class HTMLMetaDataScraper {
  constructor(data) {
    console.log(data);
    this.data = data;
  }

  __guard__(value, transform) {
    return typeof value !== 'undefined' && value !== null
      ? transform(value)
      : undefined;
  }

  removeHrefInATag(html) {
    const TAG_REGEX = /(href=".*?")/gi;
    return html.replace(TAG_REGEX, '');
  }

  removeTag(tagName, html) {
    const TAG_REGEX = new RegExp(
      `<${tagName}\\b[^<]*(?:(?!<\\/${tagName}>)<[^<]*)*<\\/${tagName}>`,
      'gi',
    );
    while (TAG_REGEX.test(html)) {
      html = html.replace(TAG_REGEX, '');
    }
    return html;
  }

  // あとで消す？
  removeScriptTag(html) {
    const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (SCRIPT_REGEX.test(html)) {
      html = html.replace(SCRIPT_REGEX, '');
    }
    return html;
  }

  getType() {
    throw new Error('処理を継承しないと違反です！！');
  }

  /**
   * linkなら本文や、動画の埋め込みリンク
   * image, videoならnull
   */
  getContent() {
    throw new Error('処理を継承しないと違反です。');
  }

  getURL() {
    throw new Error('処理を継承しないと違反です！！！');
  }

  getDescription() {
    let d1 = $('meta[name="description"]').attr('content');
    let d2 = $('meta[property="og:description"]').attr('content');
    return d1 || d2;
  }

  getFavicon() {
    let f = $('link[rel="shortcut icon"]').prop('href');
    return f;
  }

  getHostName() {
    let hn = location.host;
    return hn;
  }

  getTitle() {
    let t1 = $('head title').text();
    let t2 = $('meta[property="og:title"]').attr('content');
    let t3 = $('title').text();
    let defaultValue = $(location).attr('href'); // タイトルが得られなければURLをタイトルにする
    return t1 || t2 || t3 || defaultValue;
  }

  getSiteName() {
    let sn = $('meta[property="og:site_name"').text();
    return sn;
  }

  getSiteURL() {
    let su1 = $(location).attr('href');
    let su2 = $('meta[property="og:url"]').attr('content');
    return su1 || su2;
  }

  getSiteImage() {
    let si = $('meta[property="og:image"]').attr('content');
    return si;
  }

  getVideoURL() {
    return null;
  }

  scrape() {
    return {
      type: this.getType(),
      content: this.getContent(),
      url: this.getURL(),
      description: this.getDescription(),
      favicon: this.getFavicon(),
      hostName: this.getHostName(),
      title: this.getTitle(),
      siteImage: this.getSiteImage(),
      siteName: this.getSiteName(),
      siteUrl: this.getSiteURL(),
      videoUrl: this.getVideoURL(),
    };
  }
}
