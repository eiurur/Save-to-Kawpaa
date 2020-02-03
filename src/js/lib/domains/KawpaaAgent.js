import axios from 'axios';
import { API, CHROME_RUNTIME_ID, ENDPOINT, IS_PRODUCTION } from '../../config/';
import httpException from '../errors/httpException';

export default class KawpaaAgent {
  constructor(payload) {
    this.payload = payload === null ? {} : payload;
    this.instance = this.getAxios();
  }

  getBaseURL() {
    return IS_PRODUCTION ? ENDPOINT.PROD : ENDPOINT.ENV;
  }

  getAxios() {
    return axios.create({
      baseURL: this.getBaseURL(),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  setDefaultValueToPayload() {
    this.payload.post.isPrivate = true;
    this.payload.post.isArchive = false;
  }

  async request(method, url, payload) {
    try {
      return await this.instance({
        method,
        url,
        data: payload,
      });
    } catch (err) {
      let statusCode = 500;
      if (err.response) {
        statusCode = err.response.status;
      } else if (err.statusCode) {
        statusCode = err.statusCode;
      }

      if (httpException[statusCode]) {
        throw httpException[statusCode]();
      } else {
        throw httpException['500']();
      }
    }
  }

  async save() {
    this.setDefaultValueToPayload();
    await this.request('post', API.REGISTER, this.payload);
  }

  async get(url) {
    await this.request('get', url, this.payload);
  }

  async post(url) {
    await this.request('post', url, this.payload);
  }
}
