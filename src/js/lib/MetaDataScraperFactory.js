import ImageScraper from './metaDataScrapers/ImageScraper';
import LinkScraper from './metaDataScrapers/LinkScraper';
import TextScraper from './metaDataScrapers/TextScraper';

export default class MetaDataScraperFactory {
  static create(data) {
    if (this.isImage(data)) {
      return new ImageScraper(data);
    }
    if (this.isText(data)) {
      return new TextScraper(data);
    }
    return new LinkScraper(data);
  }

  static isImage(data) {
    return (
      (data && data.type === 'image') ||
      (data.mediaType !== null && data.menuItemId === 'image')
    );
  }

  static isText(data) {
    return data && data.menuItemId === 'selection';
  }
}
