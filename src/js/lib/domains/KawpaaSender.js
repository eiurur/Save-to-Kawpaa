import axios from 'axios';
import { API, CHROME_RUNTIME_ID, ENDPOINT } from '../../config/';

export default class KawpaaSender {
  constructor(payload) {
    this.payload = payload === null ? {} : payload;
    this.instance = this.getAxios();
  }

  format() {
    this.payload.post.isPrivate = true;
    this.payload.post.isArchive = false;
  }

  getBaseURL() {
    const isProduction = chrome.runtime.id === CHROME_RUNTIME_ID;
    return isProduction ? ENDPOINT.PROD : ENDPOINT.ENV;
  }

  getAxios() {
    return axios.create({
      baseURL: this.getBaseURL(),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  save() {
    this.format();
    return this.instance.post(API.REGISTER, this.payload);
  }

  get(url) {
    return this.instance.get(url, this.payload);
  }

  post(url) {
    return this.instance.post(url, this.payload);
  }
}
