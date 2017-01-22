const {targets} = require('../config');
const DanbooruKawpaaLinkInsertion = require('./targets/DanbooruKawpaaLinkInsertion')
const DeviantArtKawpaaLinkInsertion = require('./targets/DeviantArtKawpaaLinkInsertion')
const GelbooruKawpaaLinkInsertion = require('./targets/GelbooruKawpaaLinkInsertion')
const KonachanKawpaaLinkInsertion = require('./targets/KonachanKawpaaLinkInsertion')
const YandereKawpaaLinkInsertion = require('./targets/YandereKawpaaLinkInsertion')
const SankakuComplexKawpaaLinkInsertion = require('./targets/SankakuComplexKawpaaLinkInsertion')
const PixivKawpaaLinkInsertion = require('./targets/PixivKawpaaLinkInsertion')
const PixivMultipleKawpaaLinkInsertion = require('./targets/PixivMultipleKawpaaLinkInsertion')
const TweetDeckKawpaaButtonInsertion = require('./targets/TweetDeckKawpaaButtonInsertion')
const TwitterKawpaaButtonInsertion = require('./targets/TwitterKawpaaButtonInsertion')
const TumblrKawpaaButtonInsertion = require('./targets/TumblrKawpaaButtonInsertion')

module.exports = class InsertionFactory {
  static create(hostname, url) {

    // 例外
    if(url.indexOf(targets.PIXIV_MANGA_URL) !== -1) return new PixivMultipleKawpaaLinkInsertion();
    if(hostname.indexOf(targets.DEVIANTART_HOSTNAME) !== -1) return new DeviantArtKawpaaLinkInsertion;

    switch(hostname) {
      case targets.DANBOORU_HOSTNAME: return new DanbooruKawpaaLinkInsertion()
      case targets.GELBOORU_HOSTNAME: return new GelbooruKawpaaLinkInsertion()
      case targets.KONACHAN_HOSTNAME: return new KonachanKawpaaLinkInsertion()
      case targets.YANDE_RE_HOSTNAME: return new YandereKawpaaLinkInsertion()
      case targets.SANKAKUCOMPLEX_HOSTNAME: return new SankakuComplexKawpaaLinkInsertion()
      case targets.PIXIV_HOSTNAME: return new PixivKawpaaLinkInsertion()
      case targets.TWEETDECK_HOSTNAME: return new TweetDeckKawpaaButtonInsertion()
      case targets.TWITTER_HOSTNAME: return new TwitterKawpaaButtonInsertion()
      case targets.TUMBLR_HOSTNAME: return new TumblrKawpaaButtonInsertion()
      default: return null
    }
  }
}