(function() {
  var SELECTOR_INSERTION_TARGET_OF_KAWPAA_LINK, sendBackground, showKawpaaLink;
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
  $(document).on('click', '.kawpaa-save-link', function(e) {
    var originalImageSrc, params, srcUrl;
    e.preventDefault();
    originalImageSrc = $('#image').attr('src');
    srcUrl = originalImageSrc;
    params = {
      name: 'gelbooru',
      info: {
        type: 'image',
        srcUrl: srcUrl
      }
    };
    return sendBackground(params);
  });
  return showKawpaaLink();
})();
