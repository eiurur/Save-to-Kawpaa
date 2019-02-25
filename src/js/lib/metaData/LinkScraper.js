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
    let content = null;

    // youtube
    if (location.href.indexOf('www.youtube.com/watch?v=') > -1) {
      let vNumber = location.search
        .split('&')
        .shift()
        .split('=')
        .pop();
      content = `\
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${vNumber}" frameborder="0" allowfullscreen></iframe>\
        `;

      // ニコニコなら動画のサムネを指定
      // # ニコニコはhttpsに対応していないのでiframeがブロックされます。どうしようもないので待ちましょう。
    } else if (location.href.indexOf('www.nicovideo.jp/watch/sm') > -1) {
      let { title } = document;
      let smNumber = location.href.split('/').pop();
      content = `\
          <iframe width="312" height="176" src="//ext.nicovideo.jp/thumb/${smNumber}" scrolling="no" style="border:solid 1px #CCC;" frameborder="0"><a href="//www.nicovideo.jp/watch/${smNumber}">${title}</a></iframe>\
        `;

      // 2ch
    } else if (
      location.href.indexOf('bbspink.com') > -1 ||
      location.href.indexOf('2ch.net') > -1
    ) {
      content = this.removeScriptTag($('.thread').html());

      // ふたば
    } else if (location.href.indexOf('2chan.net') > -1) {
      content = this.removeScriptTag($('.thre').html());

      // Just for me
    } else if (location.href.indexOf('mannanoeroetaiken.blog.fc2.com') > -1) {
      content = this.removeTag(
        'img',
        this.removeTag(
          'iframe',
          this.removeHrefInATag(this.removeScriptTag($('.content').html())),
        ),
      );

      // Pornhub
    } else if (location.href.indexOf('pornhub.com') > -1) {
      var params = QueryStringParser.parse();
      content = `<iframe src="https://jp.pornhub.com/embed/${
        params.viewkey
      }" frameborder="0" width="560" height="340" scrolling="no" allowfullscreen></iframe>`;
    } else {
      content = this.removeScriptTag($('main').html());
      console.log(content);
    }

    return content;
  }

  getURL() {
    let u;

    let siteURL = this.getSiteURL();

    // デフォ値の設定
    let $img = $('img');
    let ogImage = this.getSiteImage();

    if (ogImage) {
      return ogImage;
    } else if ($img != null && $img.length > 0) {
      // bodyタグ内で一番最初の画像を引っ張ってくる
      console.log('画像ファイル発見', $img);
      let firstImgUrlInBody = $img.get(0).src;
      // 存在しないなら初期値を設定する
      // (ex) Twitterだと、"$img.get(0) = <img class=​"avatar size32" alt>​"とかになる。srcがねえ。
      u = firstImgUrlInBody || DEFAULT_IMAGE_URL;
    } else {
      // ページに画像が存在しない場合は灰色の画像を代わりに使用
      console.log('画像ファイルが見つからない。');
      u = DEFUALT_URL;
    }

    /*
    ここから例外処理(特別処理？)
    */
    // 例外中の例外。もし、他のChromeExtensionがimgを挿入していた場合、urlにchrome-extension://から始まる画像ファイルが代入され、保存に失敗してしまう。
    if (
      this.__guard__(this.__guard__(this.data, x1 => x1.url), x =>
        x.indexOf('chrome-extension://'),
      ) > -1
    ) {
      console.log('ChromeExnteionsファイルを画像に設定されてしまった。');
      u = $img.get(1).src;
    }

    // // ニコニコなら動画のサムネを指定
    // if (siteURL.indexOf('www.nicovideo.jp/watch/sm') > -1) {
    //   u =
    //     $('.videoThumbnailImage').attr('src') || // Flash版プレイヤー
    //     $('.is-playing .Image').attr('src'); // HTML5版プレイヤー
    // }

    // youtube
    // TODO: 別の動画に移動しても$('meta[property="og:image"]').attr('content')に変化なし。分からん。
    if (siteURL.indexOf('www.youtube.com/watch?v=') > -1) {
      u = this.__guard__($('meta[property="og:image"]'), x2 =>
        x2.attr('content'),
      );
    }

    // XVIDEOSなら動画のサムネを指定
    if (siteURL.indexOf('xvideos.com/video') > -1) {
      u = $('img.thumb').attr('src');
    }

    return u;
  }
}
