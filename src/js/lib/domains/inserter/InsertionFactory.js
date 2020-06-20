import $ from 'jquery';
import {
  SUPPORT_SERVICE_DOMAIN,
  SUPPORT_SERVICE_URL,
  SUPPORT_SERVICE_URL_PATTERN,
} from '../../../config';
import {
  AmatsukaLinkInsertion,
  AnimePictureKawpaaLinkInsertion,
  DanbooruKawpaaLinkInsertion,
  DeviantArtKawpaaLinkInsertion,
  GelbooruKawpaaLinkInsertion,
  IwaraKawpaaLinkInsertion,
  KonachanKawpaaLinkInsertion,
  NijieKawpaaLinkInsertion,
  NijieMultiKawpaaLinkInsertion,
  NijiuraKawpaaButtonInsertion,
  NijiuraDecKawpaaButtonInsertion,
  NozomiLaKawpaaLinkInsertion,
  PixivKawpaaLinkInsertion,
  PixivNovelKawpaaLinkInsertion,
  SankakuComplexKawpaaLinkInsertion,
  TumblrKawpaaButtonInsertion,
  TwitterKawpaaButtonInsertion,
  TweetDeckKawpaaButtonInsertion,
  YandereKawpaaLinkInsertion,
} from './service';

const patches = {
  pixiv: () => {
    let timer = setInterval(async () => {
      const illustNum = $('figure > [role="presentation"]').find(
        '[role="presentation"]',
      ).length;
      if (illustNum >= 1) {
        if (InsertionFactory.existLink()) return;
        InsertionFactory.clean();
        const inserter = new PixivKawpaaLinkInsertion();
        const success = await inserter.insert();
        if (success) inserter.on();
        // clearInterval(timer);
      }
    }, 1000);
  },
  pixivNovel: () => {
    let timer = setInterval(async () => {
      if (InsertionFactory.existLink()) return;
      InsertionFactory.clean();
      const inserter = new PixivNovelKawpaaLinkInsertion();
      const success = await inserter.insert();
      if (success) inserter.on();
      // clearInterval(timer);
    }, 1000);
  },
};

export default class InsertionFactory {
  static getKawpaaLinkElements() {
    return $('[class^="kawpaa-save-link"]');
  }
  static clean() {
    this.getKawpaaLinkElements().remove();
    return this;
  }

  static existLink() {
    return this.getKawpaaLinkElements().length > 0;
  }

  static create(hostname, url) {
    console.log(hostname, url);
    // 例外(複数)
    if (url.includes(SUPPORT_SERVICE_URL.PIXIV_URL)) {
      patches.pixiv();
      return new PixivKawpaaLinkInsertion();
    }
    if (
      url.includes(SUPPORT_SERVICE_URL.PIXIV_NOVEL_URL) ||
      SUPPORT_SERVICE_URL_PATTERN.PIXIV_NOVEL_USER.test(url)
    ) {
      patches.pixivNovel();
      return new PixivNovelKawpaaLinkInsertion();
    }
    if (url.includes(SUPPORT_SERVICE_URL.NIJIE_MULTI_URL)) {
      return new NijieMultiKawpaaLinkInsertion();
    }

    // 例外(単数)
    if (hostname.includes(SUPPORT_SERVICE_DOMAIN.DEVIANTART_HOSTNAME))
      return new DeviantArtKawpaaLinkInsertion();
    if (hostname.includes(SUPPORT_SERVICE_DOMAIN.IWARA_HOSTNAME))
      return new IwaraKawpaaLinkInsertion();
    if (url.includes(SUPPORT_SERVICE_URL.NIJIE_URL))
      return new NijieKawpaaLinkInsertion();
    if (hostname.includes(SUPPORT_SERVICE_DOMAIN.NIJIURA_HOSTNAME))
      return new NijiuraKawpaaButtonInsertion();

    switch (hostname) {
      case SUPPORT_SERVICE_DOMAIN.AMATSUKA_HOSTNAME:
        return new AmatsukaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.ANIME_PICTURE_HOSTNAME:
        return new AnimePictureKawpaaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.DONMAI_HOSTNAME:
      case SUPPORT_SERVICE_DOMAIN.DANBOORU_HOSTNAME:
        return new DanbooruKawpaaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.GELBOORU_HOSTNAME:
        return new GelbooruKawpaaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.KONACHAN_HOSTNAME:
        return new KonachanKawpaaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.NIJIURA_DECK_HOSTNAME:
        return new NijiuraDecKawpaaButtonInsertion();
      case SUPPORT_SERVICE_DOMAIN.NOZOMI_LA_HOSTNAME:
        return new NozomiLaKawpaaLinkInsertion();
      // case SUPPORT_SERVICE_DOMAIN.PIXIV_HOSTNAME:
      //   patches.pixiv();
      //   return new PixivKawpaaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.SANKAKUCOMPLEX_HOSTNAME:
        return new SankakuComplexKawpaaLinkInsertion();
      case SUPPORT_SERVICE_DOMAIN.TUMBLR_HOSTNAME:
        return new TumblrKawpaaButtonInsertion();
      case SUPPORT_SERVICE_DOMAIN.TWEETDECK_HOSTNAME:
        return new TweetDeckKawpaaButtonInsertion();
      case SUPPORT_SERVICE_DOMAIN.TWITTER_HOSTNAME:
        return new TwitterKawpaaButtonInsertion();
      case SUPPORT_SERVICE_DOMAIN.YANDE_RE_HOSTNAME:
        return new YandereKawpaaLinkInsertion();
      default:
        return null;
    }
  }
}
