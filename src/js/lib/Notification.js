const alertify = require('alertifyjs');

module.exports = class Notification {

  static log() {
    alertify.message('保存中 ...... ');
  }
  
  // アイコンに色をつけて、完了したことをわかるようにする。通知もする。
  static success() {
    chrome.runtime.sendMessage({ "newIconPath" : 'build/images/blue/icon19.png' });
    alertify.success("保存しました。");
  }

  static fail(err) {
    console.log(err);
    // console.log(err.status);

    // // res.status(err.statusCode).json statusCode: err.statusCode, message: err.messageのとき
    // if (err.responseJSON != null) {
    //   err.statusCode = err.responseJSON.statusCode;
    //   err.statusMessage = err.responseJSON.message;
    // } else if (err.status != null) { // Ajaxに失敗したとき
    //   err.statusCode = err.status;
    //   err.statusMessage = err.statusText;
    // }
    // if(err.statusCode === 412) {
    //   alertify.error(err.statusMessage); 
    // }
    if (err.statusCode) { // Base64に変換をかますときとかにこけた
      alertify.error(`Error: ${err.statusCode} ${err.statusMessage}`);
    } 
    else if (err.message) {
      alertify.error(err.message); 
    }
    else { 
      alertify.error(err.toString()); 
    }
  }
}

