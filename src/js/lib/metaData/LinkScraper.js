import $ from 'jquery';
import QueryStringParser from '../utils/QueryStringParser';
import HTMLMetaDataScraper from './HTMLMetaDataScraper';
import { DEFAULT_IMAGE_URL } from '../../config/';

export default class LinkScraper extends HTMLMetaDataScraper {
  constructor(data) {
    super(data);
    this.type = this.getType();
  }

  getType() {
    return 'link';
  }

  /**
   * linkなら本文や、動画の埋め込みリンク
   * imageならnull
   */
  getContent() {
    const isYoutube = location.href.indexOf('www.youtube.com/watch?v=') > -1;
    const isNicoNico = location.href.indexOf('www.nicovideo.jp/watch/sm') > -1;
    const is2ch =
      location.href.indexOf('bbspink.com') > -1 ||
      location.href.indexOf('2ch.net') > -1;
    const is2chan = location.href.indexOf('2chan.net') > -1;
    const isPornhub = location.href.indexOf('pornhub.com') > -1;

    let content = null;
    if (isYoutube) {
      let vNumber = location.search
        .split('&')
        .shift()
        .split('=')
        .pop();
      content = `\
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${vNumber}" frameborder="0" allowfullscreen></iframe>\
        `;
      return content;
    }
    if (isNicoNico) {
      // ニコニコなら動画のサムネを指定
      // # ニコニコはhttpsに対応していないのでiframeがブロックされます。どうしようもないので待ちましょう。
      const { title } = document;
      const smNumber = location.href.split('/').pop();
      content = `\
          <iframe width="312" height="176" src="//ext.nicovideo.jp/thumb/${smNumber}" scrolling="no" style="border:solid 1px #CCC;" frameborder="0"><a href="//www.nicovideo.jp/watch/${smNumber}">${title}</a></iframe>\
        `;
      return content;
    }
    if (is2ch) {
      content = this.removeScriptTag($('.thread').html());
      return content;
    }
    if (is2chan) {
      content = this.removeScriptTag($('.thre').html());
      return content;
    }

    if (isPornhub) {
      const params = QueryStringParser.parse();
      content = `<iframe src="https://jp.pornhub.com/embed/${params.viewkey}" frameborder="0" width="560" height="340" scrolling="no" allowfullscreen></iframe>`;
      return content;
    }

    content = this.removeScriptTag($('main').html());
    return content;
  }

  getURL() {
    const ogImage = this.getSiteImage();
    if (ogImage) return ogImage;

    let u = DEFAULT_IMAGE_URL;
    const $img = $('img');

    /*
    ここから例外処理(特別処理？)
    */
    // 例外中の例外。もし、他のChromeExtensionがimgを挿入していた場合、urlにchrome-extension://から始まる画像ファイルが代入され、保存に失敗してしまう。
    const isAtChromeExtensionPage =
      this.__guard__(
        this.__guard__(this.data, x1 => x1.url),
        x => x.indexOf('chrome-extension://'),
      ) > -1;
    if (isAtChromeExtensionPage) {
      u = $img.get(1).src;
    }

    // // ニコニコなら動画のサムネを指定
    // if (siteURL.indexOf('www.nicovideo.jp/watch/sm') > -1) {
    //   u =
    //     $('.videoThumbnailImage').attr('src') || // Flash版プレイヤー
    //     $('.is-playing .Image').attr('src'); // HTML5版プレイヤー
    // }

    let siteURL = this.getSiteURL();

    // youtube
    const youtubeMatch = /https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9\-\_]{11})/.exec(
      siteURL,
    );
    if (youtubeMatch) {
      const youtubeVideoId = youtubeMatch[1];
      if (youtubeVideoId.length == 11) {
        u = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
      }
    }

    // XVIDEOSなら動画のサムネを指定
    if (siteURL.indexOf('xvideos.com/video') > -1) {
      u = $('img.thumb').attr('src');
    }

    return u;
  }
}
