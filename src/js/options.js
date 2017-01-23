$(function() {

  chrome.storage.sync.get("token", item => $("#token").val(item.token));

  $("#token").on("keyup", () => {
    const token = $("#token").val();
    const item  = {token};
    chrome.storage.sync.set(item, () => $('#console').html(`${new Date().toLocaleString()} : トークンを保存しました`));
  });
});
