$(function() {
  return chrome.browserAction.onClicked.addListener(function(tab) {
    var keys, url;
    url = 'http://127.0.0.1:9021/api/posts';
    keys = ['token'];
    return chrome.storage.sync.get(keys, function(item) {
      console.log(item);
      if (item.token === void 0) {
        console.log('token is undefined');
        return;
      }
      console.log(item.token);
      return $.ajax({
        type: "POST",
        url: url,
        data: {
          token: item.token
        },
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        return console.log(data);
      }).fail(function(err) {
        return console.log(err);
      });
    });
  });
});
