import { targets } from '../../config/config';
import DanbooruKawpaaLinkInsertion from './targets/DanbooruKawpaaLinkInsertion';
import DeviantArtKawpaaLinkInsertion from './targets/DeviantArtKawpaaLinkInsertion';
import GelbooruKawpaaLinkInsertion from './targets/GelbooruKawpaaLinkInsertion';
// import KomifloKawpaaLinkInsertion from "./targets/KomifloKawpaaLinkInsertion";
import KonachanKawpaaLinkInsertion from './targets/KonachanKawpaaLinkInsertion';
import YandereKawpaaLinkInsertion from './targets/YandereKawpaaLinkInsertion';
import SankakuComplexKawpaaLinkInsertion from './targets/SankakuComplexKawpaaLinkInsertion';
import PixivKawpaaLinkInsertion from './targets/PixivKawpaaLinkInsertion';
import PixivMultipleKawpaaLinkInsertion from './targets/PixivMultipleKawpaaLinkInsertion';
import TweetDeckKawpaaButtonInsertion from './targets/TweetDeckKawpaaButtonInsertion';
import TwitterKawpaaButtonInsertion from './targets/TwitterKawpaaButtonInsertion';
import TumblrKawpaaButtonInsertion from './targets/TumblrKawpaaButtonInsertion';

export default class InsertionFactory {
  static create(hostname, url) {
    // 例外
    if (url.indexOf(targets.PIXIV_MANGA_URL) !== -1)
      return new PixivMultipleKawpaaLinkInsertion();
    if (hostname.indexOf(targets.DEVIANTART_HOSTNAME) !== -1)
      return new DeviantArtKawpaaLinkInsertion();

    switch (hostname) {
      case targets.DANBOORU_HOSTNAME:
        return new DanbooruKawpaaLinkInsertion();
      case targets.GELBOORU_HOSTNAME:
        return new GelbooruKawpaaLinkInsertion();
      // case targets.KOMIFLO_HOSTNAME:
      //   return new KomifloKawpaaLinkInsertion();
      case targets.KONACHAN_HOSTNAME:
        return new KonachanKawpaaLinkInsertion();
      case targets.YANDE_RE_HOSTNAME:
        return new YandereKawpaaLinkInsertion();
      case targets.SANKAKUCOMPLEX_HOSTNAME:
        return new SankakuComplexKawpaaLinkInsertion();
      case targets.PIXIV_HOSTNAME:
        return new PixivKawpaaLinkInsertion();
      case targets.TWEETDECK_HOSTNAME:
        return new TweetDeckKawpaaButtonInsertion();
      case targets.TWITTER_HOSTNAME:
        return new TwitterKawpaaButtonInsertion();
      case targets.TUMBLR_HOSTNAME:
        return new TumblrKawpaaButtonInsertion();
      default:
        return null;
    }
  }
}
