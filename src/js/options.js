$(function() {
  chrome.storage.sync.get("token", item => $("#token").val(item.token));

  $("#token").on("keyup", () => {
    const token = $("#token").val();
    chrome.storage.sync.set({ token }, () =>
      $("#console").html(`${new Date().toLocaleString()} : トークンを保存しました`)
    );
  });
});
