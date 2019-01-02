import ImageScraper from './ImageScraper';
import LinkScraper from './LinkScraper';
import TextScraper from './TextScraper';
import VideoScraper from './VideoScraper';

export default class MetaDataScraperFactory {
  static create(data) {
    if (this.isImage(data)) {
      return new ImageScraper(data);
    }
    if (this.isText(data)) {
      return new TextScraper(data);
    }
    if (this.isVideo(data)) {
      return new VideoScraper(data);
    }
    return new LinkScraper(data);
  }

  static isImage(data) {
    return (
      data &&
      (data.type === 'image' ||
        (data.mediaType !== null && data.menuItemId === 'image'))
    );
  }

  static isText(data) {
    return data && data.menuItemId === 'selection';
  }

  static isVideo(data) {
    return data && (data.type === 'video' || data.menuItemId === 'video');
  }
}
