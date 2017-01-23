const axios = require('axios');

module.exports = class KawpaaSender {

  constructor(payload) {
    this.payload = (payload === null) ? {} : payload;
    this.instance = this.getAxios();
    this.format();
  }

  format() {
    this.payload.post.isPrivate = true;
    this.payload.post.isArchive = false;
  }

  getBaseURL() {
    const CHROME_RUNTIME_ID = 'dghanpofbgihidnoofloojkpbkgjkfgg';
    const isProduction = chrome.runtime.id === CHROME_RUNTIME_ID;
    return (isProduction) ? 'https://kawpaa.eiurur.xyz/' : 'https://127.0.0.1:9021/';
  }

  getAxios() {
    return axios.create({
      baseURL: this.getBaseURL(),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      this.instance.post('/api/posts', this.payload)
      .then( (response) => resolve(response) )
      .catch( err => reject(err) );
    });
  }
}

