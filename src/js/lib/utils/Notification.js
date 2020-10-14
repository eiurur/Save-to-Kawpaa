import alertify from 'alertifyjs';
import { CHROME_EXTENSION_RESOURCES } from '../../config/';

export default class Notification {
  static log() {
    alertify.message('Saving ...... ');
  }

  // アイコンに色をつけて、完了したことをわかるようにする。通知もする。
  static success() {
    chrome.runtime.sendMessage({
      newIconPath: CHROME_EXTENSION_RESOURCES.images.BLUE_19,
    });
    alertify.success('Saved :)');
  }

  static fail(err) {
    if (!err) {
      alertify.error(
        `statusCode: 500 <br> Kawpaa server has problems. Please wait for a moment.`,
      );
    } else if (err.response) {
      // axios
      alertify.error(
        `statusCode: ${err.response.status} <br> statusText: ${err.response.statusText} <br> ${err.response.data.message}`,
      );
    } else if (err.statusCode) {
      // Base64に変換をかますときとかにこけた
      alertify.error(`statusCode: ${err.statusCode} <br> ${err.statusMessage}`);
    } else if (err.message) {
      // chrome extension内の例外処理
      alertify.error(err.message);
    } else {
      alertify.error(err.toString());
    }
  }

  static makeErrorMessgage(err) {
    let errorReason = err
    if(err) {
      errorReason = err.response ? err.response : err.message;
    }
    const errorMessage = [
      '<b>Failed to save.</b>',
      '<b>Cause of failure</b> ',
      errorReason,
      '<b>Do you want to report symptom of this problem?</b>',
    ].join('<br><br>');
    return errorMessage.replace(/\r?\n/g, '<br>');
  }

  static confirm({ message, callback }) {
    return new Promise((resolve, reject) => {
      alertify.confirm(
        message,
        () => resolve(),
        () => reject(),
      );
    });
  }

  static build({ name, header, message }) {
    if (!alertify[name]) {
      alertify.dialog(
        name,
        function factory() {
          return {
            build: function() {
              this.setHeader(header);
            },
          };
        },
        true,
        'confirm',
      );
    }
    return new Promise((resolve, reject) => {
      alertify[name](
        message,
        () => resolve(),
        () => reject(),
      );
    });
  }
}
