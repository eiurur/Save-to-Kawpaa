$(function () {
  const onSavedToken = () => {
    const token = $('#token').val();
    chrome.storage.sync.set({ token }, () => {
      const message = `${new Date().toLocaleString()} : Saved a token :)`;
      $('#console').html(message);
    });
  };

  chrome.storage.sync.get('token', (item) => $('#token').val(item.token));
  $('#token').on('keyup', onSavedToken);

  const onSavedEndpoint = () => {
    const endpoint = $('#endpoint').val();
    chrome.storage.sync.set({ endpoint }, () => {
      const message = `${new Date().toLocaleString()} : Saved a endpoint :)`;
      $('#console').html(message);
    });
  };
  chrome.storage.sync.get('endpoint', (item) =>
    $('#endpoint').val(item.endpoint)
  );
  $('#endpoint').on('keyup', onSavedEndpoint);
});
