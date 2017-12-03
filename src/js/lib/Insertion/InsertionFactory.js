import { targets } from '../../config/config';
import DanbooruKawpaaLinkInsertion from './targets/DanbooruKawpaaLinkInsertion';
import DeviantArtKawpaaLinkInsertion from './targets/DeviantArtKawpaaLinkInsertion';
import GelbooruKawpaaLinkInsertion from './targets/GelbooruKawpaaLinkInsertion';
// import KomifloKawpaaLinkInsertion from "./targets/KomifloKawpaaLinkInsertion";
import KonachanKawpaaLinkInsertion from './targets/KonachanKawpaaLinkInsertion';
import IwaraKawpaaLinkInsertion from './targets/IwaraKawpaaLinkInsertion';
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
    if (url.includes(targets.PIXIV_MANGA_URL))
      return new PixivMultipleKawpaaLinkInsertion();
    if (hostname.includes(targets.DEVIANTART_HOSTNAME))
      return new DeviantArtKawpaaLinkInsertion();
    if (hostname.includes(targets.IWARA_HOSTNAME))
      return new IwaraKawpaaLinkInsertion();

    switch (hostname) {
      case targets.DANBOORU_HOSTNAME:
        return new DanbooruKawpaaLinkInsertion();
      case targets.GELBOORU_HOSTNAME:
        return new GelbooruKawpaaLinkInsertion();
      // case targets.KOMIFLO_HOSTNAME:
      //   return new KomifloKawpaaLinkInsertion();
      case targets.KONACHAN_HOSTNAME:
        return new KonachanKawpaaLinkInsertion();
      // case targets.IWARA_HOSTNAME:
      //   return new IwaraKawpaaLinkInsertion();
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
