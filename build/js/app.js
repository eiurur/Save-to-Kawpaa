$(function() {

  /*
  For options.html
   */
  chrome.storage.sync.get("token", function(item) {
    return $("#token").val(item.token);
  });
  $("#token").on("keyup", function() {
    var item, token;
    token = $("#token").val();
    item = {
      token: token
    };
    return chrome.storage.sync.set(item, function() {
      return $('#console').html((moment().format('YYYY MMMM Do, h:mm:ss')) + ": トークンを保存しました");
    });
  });

  /*
  Pixiv
   */
  chrome.storage.sync.get('pixiv_username', function(item) {
    return $('#pixiv_username').val(item.pixiv_username);
  });
  chrome.storage.sync.get('pixiv_password', function(item) {
    return $('#pixiv_password').val(item.pixiv_password);
  });
  $("#pixiv_username").on("keyup", function() {
    var pixivUsernameItem, pixiv_username;
    pixiv_username = $("#pixiv_username").val();
    pixivUsernameItem = {
      pixiv_username: pixiv_username
    };
    return chrome.storage.sync.set(pixivUsernameItem, function() {
      return $('#console').html((moment().format('YYYY MMMM Do, h:mm:ss')) + ": pixivのデータを保存しました");
    });
  });
  return $("#pixiv_password").on("keyup", function() {
    var pixivPasswordItem, pixiv_password;
    pixiv_password = $("#pixiv_password").val();
    pixivPasswordItem = {
      pixiv_password: pixiv_password
    };
    return chrome.storage.sync.set(pixivPasswordItem, function() {
      return $('#console').html((moment().format('YYYY MMMM Do, h:mm:ss')) + ": pixivのデータを保存しました");
    });
  });
});
