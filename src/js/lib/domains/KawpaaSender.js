import axios from 'axios';
import { API, CHROME_RUNTIME_ID, ENDPOINT } from '../../config/config';

export default class KawpaaSender {
  constructor(payload) {
    this.payload = payload === null ? {} : payload;
    this.instance = this.getAxios();
    this.format();
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
    return new Promise((resolve, reject) => {
      this.instance
        .post(API.REGISTER, this.payload)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
}
