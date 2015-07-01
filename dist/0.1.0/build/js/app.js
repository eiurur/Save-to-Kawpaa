$(function() {

  /*
  For options.html
   */
  chrome.storage.sync.get("token", function(item) {
    var token;
    token = item.token;
    return $("#token").val(token);
  });
  return $("#token").bind("keyup", function() {
    var item, token;
    token = $("#token").val();
    item = {
      token: token
    };
    return chrome.storage.sync.set(item, function() {
      return $('#console').html('tststs');
    });
  });
});
