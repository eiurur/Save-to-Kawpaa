import { SUPPORT_SERVICE, SUPPORT_URL } from '../../config/config';
import {
  DanbooruKawpaaLinkInsertion,
  DeviantArtKawpaaLinkInsertion,
  GelbooruKawpaaLinkInsertion,
  KonachanKawpaaLinkInsertion,
  IwaraKawpaaLinkInsertion,
  YandereKawpaaLinkInsertion,
  SankakuComplexKawpaaLinkInsertion,
  PixivKawpaaLinkInsertion,
  PixivMultipleKawpaaLinkInsertion,
  TweetDeckKawpaaButtonInsertion,
  TumblrKawpaaButtonInsertion,
  NijieKawpaaLinkInsertion,
  NijieMultiKawpaaLinkInsertion,
} from './supportService/';

export default class InsertionFactory {
  static create(hostname, url) {
    // 例外
    if (url.includes(SUPPORT_URL.PIXIV_MANGA_URL))
      return new PixivMultipleKawpaaLinkInsertion();
    if (url.includes(SUPPORT_URL.NIJIE_URL))
      return new NijieKawpaaLinkInsertion();
    if (url.includes(SUPPORT_URL.NIJIE_MULTI_URL))
      return new NijieMultiKawpaaLinkInsertion();

    // 例外
    if (hostname.includes(SUPPORT_SERVICE.DEVIANTART_HOSTNAME))
      return new DeviantArtKawpaaLinkInsertion();
    if (hostname.includes(SUPPORT_SERVICE.IWARA_HOSTNAME))
      return new IwaraKawpaaLinkInsertion();

    switch (hostname) {
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
      case SUPPORT_SERVICE.YANDE_RE_HOSTNAME:
        return new YandereKawpaaLinkInsertion();
      case SUPPORT_SERVICE.SANKAKUCOMPLEX_HOSTNAME:
        return new SankakuComplexKawpaaLinkInsertion();
      case SUPPORT_SERVICE.PIXIV_HOSTNAME:
        return new PixivKawpaaLinkInsertion();
      case SUPPORT_SERVICE.TWEETDECK_HOSTNAME:
        return new TweetDeckKawpaaButtonInsertion();
      case SUPPORT_SERVICE.TWITTER_HOSTNAME:
        return new TwitterKawpaaButtonInsertion();
      case SUPPORT_SERVICE.TUMBLR_HOSTNAME:
        return new TumblrKawpaaButtonInsertion();
      default:
        return null;
    }
  }
}
