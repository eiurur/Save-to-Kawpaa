import $ from 'jquery';
import { SUPPORT_SERVICE, SUPPORT_URL } from '../../../config/';
import {
  AmatsukaLinkInsertion,
  DanbooruKawpaaLinkInsertion,
  DeviantArtKawpaaLinkInsertion,
  GelbooruKawpaaLinkInsertion,
  IwaraKawpaaLinkInsertion,
  KonachanKawpaaLinkInsertion,
  NijieKawpaaLinkInsertion,
  NijieMultiKawpaaLinkInsertion,
  NijiuraKawpaaButtonInsertion,
  PixivKawpaaLinkInsertion,
  PixivMultipleKawpaaLinkInsertion,
  PixivOldMultipleKawpaaLinkInsertion,
  SankakuComplexKawpaaLinkInsertion,
  TumblrKawpaaButtonInsertion,
  TwitterKawpaaButtonInsertion,
  TweetDeckKawpaaButtonInsertion,
  YandereKawpaaLinkInsertion,
} from './supportService/';

const patches = {
  pixiv: () => {
    let timer = setInterval(async () => {
      const illustNum = $('figure > [role="presentation"]').find(
        '[role="presentation"]',
      ).length;
      if (illustNum > 1) {
        InsertionFactory.clean();
        const inserter = new PixivMultipleKawpaaLinkInsertion();
        const success = await inserter.insert();
        if (success) inserter.on();
        clearInterval(timer);
      }
    }, 1000);
  },
};

export default class InsertionFactory {
  static clean() {
    $('[class^="kawpaa-save-link"]').remove();
    return this;
  }

  static create(hostname, url) {
    // 例外(複数)
    if (url.includes(SUPPORT_URL.PIXIV_MANGA_URL))
      return [
        new PixivMultipleKawpaaLinkInsertion(),
        new PixivOldMultipleKawpaaLinkInsertion(),
      ];
    if (url.includes(SUPPORT_URL.NIJIE_MULTI_URL))
      return new NijieMultiKawpaaLinkInsertion();

    // 例外(単数)
    if (hostname.includes(SUPPORT_SERVICE.DEVIANTART_HOSTNAME))
      return new DeviantArtKawpaaLinkInsertion();
    if (hostname.includes(SUPPORT_SERVICE.IWARA_HOSTNAME))
      return new IwaraKawpaaLinkInsertion();
    if (url.includes(SUPPORT_URL.NIJIE_URL))
      return new NijieKawpaaLinkInsertion();
    if (hostname.includes(SUPPORT_SERVICE.NIJIURA_HOSTNAME))
      return new NijiuraKawpaaButtonInsertion();

    switch (hostname) {
      case SUPPORT_SERVICE.AMATSUKA_HOSTNAME:
        return new AmatsukaLinkInsertion();
      case SUPPORT_SERVICE.DONMAI_HOSTNAME:
      case SUPPORT_SERVICE.DANBOORU_HOSTNAME:
        return new DanbooruKawpaaLinkInsertion();
      case SUPPORT_SERVICE.GELBOORU_HOSTNAME:
        return new GelbooruKawpaaLinkInsertion();
      // case SUPPORT_SERVICE.KOMIFLO_HOSTNAME:
      //   return new KomifloKawpaaLinkInsertion();
      case SUPPORT_SERVICE.KONACHAN_HOSTNAME:
        return new KonachanKawpaaLinkInsertion();
      // case SUPPORT_SERVICE.IWARA_HOSTNAME:
      //   return new IwaraKawpaaLinkInsertion();
      case SUPPORT_SERVICE.PIXIV_HOSTNAME:
        patches.pixiv();
        return new PixivKawpaaLinkInsertion();
      case SUPPORT_SERVICE.SANKAKUCOMPLEX_HOSTNAME:
        return new SankakuComplexKawpaaLinkInsertion();
      case SUPPORT_SERVICE.TUMBLR_HOSTNAME:
        return new TumblrKawpaaButtonInsertion();
      case SUPPORT_SERVICE.TWEETDECK_HOSTNAME:
        return new TweetDeckKawpaaButtonInsertion();
      case SUPPORT_SERVICE.TWITTER_HOSTNAME:
        return new TwitterKawpaaButtonInsertion();
      case SUPPORT_SERVICE.YANDE_RE_HOSTNAME:
        return new YandereKawpaaLinkInsertion();
      default:
        return null;
    }
  }
}
