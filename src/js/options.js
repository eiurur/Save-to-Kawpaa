$(function() {
  const onSavedToken = () => {
    const token = $('#token').val();
    chrome.storage.sync.set({ token }, () => {
      const message = `${new Date().toLocaleString()} : トークンを保存しました`;
      $('#console').html(message);
    });
  };

  chrome.storage.sync.get('token', item => $('#token').val(item.token));
  $('#token').on('keyup', onSavedToken);
});
