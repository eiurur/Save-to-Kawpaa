import axios from 'axios';
import { API, CHROME_RUNTIME_ID, ENDPOINT } from '../../config/';
import ChromeSyncStorageManager from '../utils/ChromeSyncStorageManager';
import httpException from '../errors/httpException';
import { version } from '../../../../manifest.json';

export default class KawpaaAgent {
  constructor(payload) {
    this.payload = payload === null ? {} : payload;
    this.instance = null;
  }

  async setup() {
    this.instance = await this.getAxios();
  }

  async getBaseURL() {
    const endpoint = await ChromeSyncStorageManager.get('endpoint');
    return endpoint ? endpoint : ENDPOINT.DEFAULT;
  }

  async getAxios() {
    const baseURL = await this.getBaseURL();
    return axios.create({
      baseURL,
    });
  }

  setDefaultValueToPayload() {
    this.payload.post.isPrivate = true;
    this.payload.post.isArchive = false;
  }

  setVersion() {
    this.payload.version = version;
  }

  async request(method, url, payload) {
    try {
      return await this.instance({
        method,
        url,
        data: payload,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    } catch (err) {
      console.log(err);
      let statusCode = 500;
      if (err.response) statusCode = err.response.status;
      else if (err.statusCode) statusCode = err.statusCode;

      let errorMessage = err;
      if (err.response) errorMessage = err.response.data;
      throw httpException.happend(errorMessage, statusCode);
    }
  }

  async save() {
    this.setDefaultValueToPayload();
    this.setVersion();
    return await this.request('post', API.REGISTER, this.payload);
  }

  async get(url) {
    this.setVersion();
    return await this.request('get', url, this.payload);
  }

  async post(url) {
    this.setVersion();
    return await this.request('post', url, this.payload);
  }
}
