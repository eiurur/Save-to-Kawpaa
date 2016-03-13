(function() {
  var SELECTOR_INSERTION_TARGET_OF_KAWPAA_LINK, getParamsToServer, sendBackground, showKawpaaLink;
  SELECTOR_INSERTION_TARGET_OF_KAWPAA_LINK = '#right-col h4';
  showKawpaaLink = function() {
    var html;
    html = " |\n<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
    return $(document).find(SELECTOR_INSERTION_TARGET_OF_KAWPAA_LINK).append(html);
  };
  sendBackground = function(params) {
    console.log(params);
    return chrome.runtime.sendMessage(params, function(response) {
      return console.log(response);
    });
  };
  getParamsToServer = function() {
    var hostname, originalImageSrc, params, srcUrl;
    hostname = location.host;
    console.log(hostname);
    switch (hostname) {
      case 'gelbooru.com':
        originalImageSrc = $('#image').attr('src');
        srcUrl = originalImageSrc;
        params = {
          name: 'gelbooru',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
        break;
      case 'konachan.com':
        originalImageSrc = $('#image').attr('src');
        srcUrl = originalImageSrc;
        params = {
          name: 'konachan',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
        break;
      case 'yande.re':
        originalImageSrc = $('#image').attr('src');
        srcUrl = originalImageSrc;
        params = {
          name: 'yande.re',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
    }
    return params;
  };
  $(document).on('click', '.kawpaa-save-link', function(e) {
    var params;
    e.preventDefault();
    params = getParamsToServer();
    return sendBackground(params);
  });
  return showKawpaaLink();
})();
